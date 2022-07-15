const router = require('express').Router();
const {addComment, removeComment, addReply, removeReply} = require('../../controllers/comment-controller');

// /api/comments/:id
router.route('/:pizzaId').post(addComment);

// /api/comments/:pizzaId/:commentId
router
.route('/:pizzaId/:commentId')
.put(addReply)
.delete(removeComment);

//new route because remove reply needs replyid
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router