const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator/check')

const profile = require('../../models/Profile')
const User = require('../../models/User')
    // @routen GET api / profile/me
    // @desc Get current users profile
    //@accesss private
router.get('/me', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});
// @routen POST api / profile
// @desc Create or update user profile
//@accesss private
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty()
]], async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;
    const profileFields = {}
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trin())
    }
    // Built social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram
    console.log(profileFields.social.twitter)
    res.send("Hello")
})
module.exports = router;