const { validationResult } = require("express-validator");
const UserModel = require("../models/User");
const { hashedPassword, createToken, comparePassword } = require("../services/authServices");

// @route POST /api/register
// @access Public
// @desc Create user and return a token
module.exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { name, email, password, admin } = req.body;
        try {
            const emailExist = await UserModel.findOne({ email });
            if (!emailExist) {
                const hashed = await hashedPassword(password);
                
                // Admin bilgisini kontrol et ve güvenli bir şekilde işle
                // Varsayılan olarak admin false olmalı, sadece özel durumlarda true olabilir
                const isAdmin = admin === true;
                
                const user = await UserModel.create({
                    name,
                    email,
                    password: hashed,
                    admin: isAdmin // Kontrol edilmiş admin değerini kullan
                });
                const token = createToken({
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    admin: user.admin
                });
                return res.status(201).json({
                    msg: 'The account has been created!',
                    token,
                    admin: user.admin
                });
            } else {
                // email already taken
                return res.status(400).json({ errors: [{ msg: `${email} is already taken`, param: 'email' }] })
            }
        } catch (error) {
            console.log(error.message);
            return res.status(500).json("Server internal error!");
        }
    } else {
        // validations failed
        return res.status(400).json({ errors: errors.array() })
    }
}

// @route POST /api/login
// @access Public
// @desc Login user and return a token

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const user = await UserModel.findOne({ email });
            if (user) {
                if (await comparePassword(password, user.password)) {
                    const token = createToken({
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        admin: user.admin
                    });
                    return res.status(201).json({
                        token,
                        admin: user.admin
                    });
                } else {
                    return res.status(400).json({ errors: [{ msg: 'password not matched!', param: 'password' }] })
                }
            } else {
                return res.status(400).json({ errors: [{ msg: `${email} is not found!`, param: 'email' }] });
            }
        } catch (error) {
            console.log(error.message)
            return res.status(500).json('Server internal error!');
        }
    } else {
        //  validations failed
        return res.status(400).json({ errors: errors.array() })
    }
}

// @route GET /api/users
// @access Private (Admin only)
// @desc Get all users
module.exports.getAllUsers = async (req, res) => {

    try {
        const users = await UserModel.find().select('-password');

        return res.status(200).json(users);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Server internal error!");
    }
}

module.exports.getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserModel.findById(id).select('-password');
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json("Server internal error.");
    }
}
// @route PUT /api/users/:id
// @access Private (Admin only)
// @desc Update a user
module.exports.updateUser = async (req, res) => {

    try {
        const { id } = req.params;
        const { name, email, admin, password } = req.body;

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        
        // Şifre sadece yeni bir şifre gönderildiğinde güncellenir
        if (password && password.trim() !== '') {
            user.password = await hashedPassword(password);
        }
        
        // Admin bilgisini güvenli bir şekilde güncelle
        // Sadece admin değeri açıkça belirtilmişse güncelle
        if (admin !== undefined) {
            // Admin değerini boolean olarak dönüştür
            user.admin = admin === true;
        }

        await user.save();
        return res.status(200).json({ msg: 'User updated successfully', user });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Server internal error!");
    }
}

// @route DELETE /api/users/:id
// @access Private (Admin only)
// @desc Delete a user
module.exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        return res.status(200).json({ msg: 'User deleted successfully' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Server internal error!");
    }
}

// @route POST /api/admin/login
// @access Public
// @desc Login admin and return a token
module.exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const user = await UserModel.findOne({ email });
            if (user) {
                if (await comparePassword(password, user.password)) {
                    if (!user.admin) {
                        return res.status(403).json({ errors: [{ msg: 'Access denied. Admin privileges required.', param: 'email' }] });
                    }
                    const token = createToken({
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        admin: user.admin
                    });
                    return res.status(201).json({
                        token,
                        admin: user.admin
                    });
                } else {
                    return res.status(400).json({ errors: [{ msg: 'password not matched!', param: 'password' }] })
                }
            } else {
                return res.status(400).json({ errors: [{ msg: `${email} is not found!`, param: 'email' }] });
            }
        } catch (error) {
            console.log(error.message)
            return res.status(500).json('Server internal error!');
        }
    } else {
        //  validations failed
        return res.status(400).json({ errors: errors.array() })
    }
}