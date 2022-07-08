const router = require('express').Router();
const { User, Project } = require('../models');

// GET all Users for homepage
router.get('/', async (req, res) => {
    try {
        const dbUserData = await User.findAll({
            include: [
                {
                    model: Project,
                    attributes: ['id', 'name','description', 'date_created','needed_funding', 'user_id'],
                },
            ],
        });

        const users = dbUserData.map((users) =>
            User.get({ plain: true })
        );

        res.render('homepage', {
            users,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET one gallery
router.get('/user/:id', async (req, res) => {
    // If the user is not logged in, redirect the user to the login page
    if (!req.session.loggedIn) {
        res.redirect('/login');
    } else {
        // If the user is logged in, allow them to view the gallery
        try {
            const dbUserData = await User.findByPk(req.params.id, {
                include: [
                    {
                        model: Project,
                        attributes: [
                            'id',
                            'name',
                            'description',
                            'date_created',
                            'needed_funding',
                            'user_id'
                        ],
                    },
                ],
            });
            const User = dbUserData.get({ plain: true });
            res.render('user', { user, loggedIn: req.session.loggedIn });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
});

// GET one painting
router.get('/project/:id', async (req, res) => {
    // If the user is not logged in, redirect the user to the login page
    if (!req.session.loggedIn) {
        res.redirect('/login');
    } else {
        // If the user is logged in, allow them to view the painting
        try {
            const dbProjectData = await Project.findByPk(req.params.id);

            const project = dbProjectData.get({ plain: true });

            res.render('project', { project, loggedIn: req.session.loggedIn });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

module.exports = router;