const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const userController = require('../controllers/user.controller');

/**
 * @route   GET /api/users
 * @desc    Get all users (filtered by role)
 * @access  Private (Admin, Department Manager)
 */
router.get('/', authenticate, requireRole(['Admin', 'Department Manager']), userController.getUsers);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private (Admin only)
 */
router.post('/', authenticate, requireRole(['Admin']), userController.createUser);

/**
 * @route   GET /api/users/departments
 * @desc    Get departments list
 * @access  Private
 */
router.get('/departments', authenticate, userController.getDepartments);

/**
 * @route   GET /api/users/roles
 * @desc    Get roles list
 * @access  Private
 */
router.get('/roles', authenticate, userController.getRoles);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin, Department Manager)
 */
router.get('/:id', authenticate, requireRole(['Admin', 'Department Manager']), userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Admin, Department Manager)
 */
router.put('/:id', authenticate, requireRole(['Admin', 'Department Manager']), userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, requireRole(['Admin']), userController.deleteUser);

module.exports = router;
