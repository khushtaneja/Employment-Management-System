const express = require('express');
const { body } = require('express-validator');
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const DEPARTMENTS = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations'];

// Validation rules for create/update
const employeeValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('department')
    .notEmpty().withMessage('Department is required')
    .isIn(DEPARTMENTS).withMessage(`Department must be one of: ${DEPARTMENTS.join(', ')}`),
  body('position')
    .trim()
    .notEmpty().withMessage('Position is required')
    .isLength({ max: 100 }).withMessage('Position cannot exceed 100 characters'),
  body('salary')
    .notEmpty().withMessage('Salary is required')
    .isNumeric().withMessage('Salary must be a number')
    .custom((val) => val >= 0 && val <= 10000000).withMessage('Salary must be between 0 and 10,000,000'),
  body('dateOfJoining')
    .notEmpty().withMessage('Date of joining is required')
    .isISO8601().withMessage('Date of joining must be a valid date'),
];

// All routes require authentication
router.use(protect);

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', adminOnly, employeeValidation, createEmployee);
router.put('/:id', adminOnly, employeeValidation, updateEmployee);
router.delete('/:id', adminOnly, deleteEmployee);

module.exports = router;
