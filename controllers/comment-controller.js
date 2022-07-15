const { Pizza, Comment } = require('../models');

const commentController = {
    //add comment to pizza
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $push: { comments: _id } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if(!dbPizzaData) {
                    res.status(404).json({ message: 'No pizz found with this id!'});
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    //add a reply to a comment
    addReply({params, body}, res){
        Comment.findOneAndUpdate(
            {_id: params.commentId},
            {$push: {replies: body}},
            {new: true}
        )
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData)
        })
        .catch(err => res.json(err));
    },

    //remove a reply to a coment 
    removeReply({params}, res) {
        Comment.findOneAndDelete(
            {_id: params.commentId},
            {$pull: {comments: params}},
            {new: true}
        )
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err))
    },

    //remove comment
    removeComment({ params }, res) {
        //finds comment based on id, deletes and returns deleted information
        Comment.findOneAndDelete({_id: params.commentId})
        .then(deletedComment => {
            if(!deletedComment){
                return res.status(404).json({ message: 'No comment with this id!'});
            }
            //finds pizza based off the return data of the deleted comment
            //pulls that comment off the pizza with the associated id found in the passed data
            return Pizza.findOneAndUpdate(
                {_id: params.pizzaId},
                { $pull: {comments: params.commentId} },
                {new: true}
            );
        })
        //returns updated pizza without the deleted comment
        .then(dbPizzaData => {
            if(!dbPizzaData){
                res.status(404).json({message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = commentController;