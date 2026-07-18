const { validationResult } = require('express-validator');
const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: `Employee with ID ${req.params.id} not found` });
    }
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

// @desc    Create employee
// @route   POST /api/employees
// @access  Private/Admin
const createEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { firstName, lastName, email, department, position, salary, dateOfJoining, isActive } =
      req.body;

    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      department,
      position,
      salary,
      dateOfJoining,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
const updateEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: `Employee with ID ${req.params.id} not found` });
    }

    const { firstName, lastName, email, department, position, salary, dateOfJoining, isActive } =
      req.body;

    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.email = email;
    employee.department = department;
    employee.position = position;
    employee.salary = salary;
    employee.dateOfJoining = dateOfJoining;
    employee.isActive = isActive;

    const updated = await employee.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: `Employee with ID ${req.params.id} not found` });
    }

    await employee.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
