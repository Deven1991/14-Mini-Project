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
router.get('/gallery/:id', async (req, res) => {
    // If the user is not logged in, redirect the user to the login page
    if (!req.session.loggedIn) {
        res.redirect('/login');
    } else {
        // If the user is logged in, allow them to view the gallery
        try {
            const dbGalleryData = await User.findByPk(req.params.id, {
                include: [
                    {
                        model: Painting,
                        attributes: [
                            'id',
                            'title',
                            'artist',
                            'exhibition_date',
                            'filename',
                            'description',
                        ],
                    },
                ],
            });
            const gallery = dbGalleryData.get({ plain: true });
            res.render('gallery', { gallery, loggedIn: req.session.loggedIn });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
});

// GET one painting
router.get('/painting/:id', async (req, res) => {
    // If the user is not logged in, redirect the user to the login page
    if (!req.session.loggedIn) {
        res.redirect('/login');
    } else {
        // If the user is logged in, allow them to view the painting
        try {
            const dbPaintingData = await Painting.findByPk(req.params.id);

            const painting = dbPaintingData.get({ plain: true });

            res.render('painting', { painting, loggedIn: req.session.loggedIn });
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
