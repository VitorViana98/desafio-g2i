// DO NOT MODIFY THIS FILE
const {v4: generateId} = require("uuid");
const preexistingNews = [
    ({
        id: generateId(),
        author: 'author1',
        title: 'Shocking development in the trial!',
        text: 'Trial has been dismissed',
    }),
    ({
        id: generateId(),
        author: 'author2',
        title: 'Cat on a tree',
        text: 'Firefighters helped getting a frightened kitten down',
    }),
];

module.exports = {
    preexistingNews,
}
