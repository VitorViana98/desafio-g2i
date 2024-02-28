const request = require('supertest');

const {createServer} = require('./server');
const {setNews} = require("./news/handlers");
const {setUsers} = require("./auth/handlers");
const {preexistingNews} = require("./news/preexisting-news");
const {users} = require("./auth/users");

describe('News Server', () => {
    const author = 'author1';
    let server;

    function expectPreexistingNews(news, additionalNews = false) {
        const expectedLength = !additionalNews ? preexistingNews.length : preexistingNews.length + 1;
        expect(news.length).toEqual(expectedLength);
        preexistingNews.forEach(preexistingNews => expect(news).toContain(preexistingNews));
    }

    function getLoggedInUsersNews() {
        return preexistingNews[0];
    }

    function getAnotherAuthorsNews() {
        return preexistingNews[1];
    }

    const login = (username = author, password = 'password1') => request(server)
        .post('/auth/login')
        .send({username, password});

    const readNews = () => request(server)
        .get('/news')
        .expect('Content-Type', /json/)
        .expect(200);

    function makeTestsTimeoutSmaller() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 300;
    }

    beforeEach(() => {
        makeTestsTimeoutSmaller();
        server = createServer();
        setNews(preexistingNews);
        setUsers(users);
    });

    afterEach(() => {
        server.close();
    })

    describe('Logging in', () => {
        it('should login with correct credentials', (done) => {
            login()
                .expect('Content-Type', /json/)
                .expect(200)
                .then(response => {
                    const tokenRegexp = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/;
                    expect(response.body.token).toMatch(tokenRegexp);
                })
                .finally(done);
        });

        it('should fail to login with wrong password', (done) => {
            login(author, 'wrong password')
                .expect('Content-Type', /json/)
                .expect(403, done);
        });
    });

    describe('Logging out', () => {
        it('should log user out if correct token is passed', (done) => {
            login().then(({body}) => {
                request(server)
                    .post('/auth/logout')
                    .send({token: body.token})
                    .expect(200, done);
            })
        });
    });

    describe('Reading news', () => {
        it('should read news', (done) => {
            readNews()
                .then(({body}) => {
                    expectPreexistingNews(body);
                })
                .finally(done);
        });
    });

    describe('Adding news', () => {
        it('should add news if authorized', (done) => {
            const title = 'Latest news';
            const text = 'Some content';

            login()
                .then(({body: {token}}) =>
                    request(server)
                        .post('/news')
                        .send({
                            title,
                            text,
                            token,
                        })
                        .expect('Content-Type', /json/)
                        .expect(201))
                .then(() => readNews())
                .then(({body}) => {
                    expectPreexistingNews(body, true);
                    const addedNews = body.find(news => news.title === title);
                    expect(addedNews.text).toEqual(text);
                    expect(addedNews.author).toEqual(author);
                })
                .finally(done);
        });

        it('should fail to add news if token is invalid', (done) => {
            const title = 'Latest news';
            const text = 'Some content';

            request(server)
                .post('/news')
                .send({
                    title,
                    text,
                    token: 'invalid token',
                })
                .expect(403)
                .then(() => readNews())
                .then(({body}) => {
                    expectPreexistingNews(body);
                })
                .finally(done);
        });
    });

    describe('Editing news', () => {
        it('should edit own news if authorized', (done) => {
            const editedNewsId = getLoggedInUsersNews().id;
            const title = 'Updated title';
            const text = 'Updated content';

            login()
                .then(({body: {token}}) =>
                    request(server)
                        .put(`/news/${editedNewsId}`)
                        .send({
                            title,
                            text,
                            token,
                        })
                        .expect('Content-Type', /json/)
                        .expect(200))
                .then(() => readNews())
                .then(({body}) => {
                    expect(body).toContain(getAnotherAuthorsNews());
                    const editedNews = body.find(news => news.id === editedNewsId);
                    expect(editedNews).toEqual({
                        id: editedNewsId,
                        title,
                        text,
                        author: author,
                    });
                })
                .finally(done);
        });
    });

    describe('Deleting news', () => {
        it('should delete own news if authorized', (done) => {
            const deletedNewsId = getLoggedInUsersNews().id;

            login()
                .then(({body: {token}}) =>
                    request(server)
                        .delete(`/news/${deletedNewsId}`)
                        .send({token})
                        .expect('Content-Type', /json/)
                        .expect(200))
                .then(() => readNews())
                .then(({body}) => {
                    expect(body.length).toEqual(preexistingNews.length - 1);
                    expect(body).toContain(getAnotherAuthorsNews());
                    expect(body).not.toContain(getLoggedInUsersNews());
                })
                .finally(done);
        });
    });
});
