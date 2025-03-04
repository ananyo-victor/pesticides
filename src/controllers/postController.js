import Post from '../models/postModel.js';

const createPost = async (req, res) => {
    const { title, description, location, skills, salary, experience, education, hrId, status } = req.body;
    try {
        const newPost = new Post({
            title,
            description,
            location,
            skills,
            salary,
            experience,
            education,
            hrId,
            status,
        });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
}