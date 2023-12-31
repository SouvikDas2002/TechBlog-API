const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");

//CREATE post

router.post("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.username === req.body.username) {
      const newPost = new Post(req.body);
      try {
        const savePost = await newPost.save();
        res.status(200).json(savePost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(500).json("You can only post with ur account name");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE Post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username == req.body.username) {
      try {
        const updatePost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatePost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update on;y your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username == req.body.username) {
      try {
        await post.deleteOne();
        res.status(200).json("post has been deleted");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete your own post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET POSts

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET all Posts

router.get("/", async (req, res) => {
  const username = req.query.user;
  const catname = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catname) {
      posts = await Post.find({
        categories: {
          $in: [catname],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
