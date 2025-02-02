import express from 'express';
import Budget from '../models/Budget.js';
import logger from '../config/logger.js';
import { validateBudget } from '../middlewares/budgetValidation.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/budget
 * @desc    Fetch the budget document for the logged-in user
 */
router.get('/', requireAuth, async (req, res) => {
  logger.info('GET /api/budget - Fetching budget');
  try {
    const budget = await Budget.findOne({ user: req.userId });
    if (!budget) {
      logger.warn('No budget found in the system');
      return res.status(404).json({ error: 'No budget record found.' });
    }

    logger.info('Budget fetched successfully');
    res.status(200).json(budget);
  } catch (err) {
    logger.error('Error fetching budget:', err.message);
    res.status(500).json({ error: 'Failed to fetch budget information.' });
  }
});

/**
 * @route   POST /api/budget
 * @desc    Create a new budget record
 */
router.post('/', requireAuth, validateBudget, async (req, res) => {
  logger.info('POST /api/budget - Creating new budget record');
  try {
    const { categoryBudgets, interval = 'monthly' } = req.body;

    const sumCategoryBudgets = Object.values(categoryBudgets || {}).reduce(
      (sum, val) => sum + val,
      0
    );

    const newBudget = new Budget({
      user: req.userId,
      totalBudget: sumCategoryBudgets,
      categoryBudgets: categoryBudgets || {},
      interval,
    });

    const savedBudget = await newBudget.save();
    logger.info('New budget created successfully:', savedBudget);

    res.status(201).json(savedBudget);
  } catch (err) {
    logger.error('Error creating budget:', err.message);
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

/**
 * @route   PUT /api/budget/:id
 * @desc    Update an existing budget record
 */
router.put('/:id', requireAuth, validateBudget, async (req, res) => {
  logger.info(`PUT /api/budget/${req.params.id} - Updating budget`);
  try {
    const { categoryBudgets, interval } = req.body;

    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      logger.warn(`Budget not found for id: ${req.params.id}`);
      return res.status(404).json({ error: 'Budget not found' });
    }

    if (budget.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: 'Not authorized to edit this budget' });
    }

    if (categoryBudgets !== undefined) {
      budget.categoryBudgets = categoryBudgets;
      const sumCategoryBudgets = Object.values(categoryBudgets).reduce(
        (sum, val) => sum + val,
        0
      );
      budget.totalBudget = sumCategoryBudgets;
    }

    if (interval !== undefined) {
      budget.interval = interval;
    }

    const updatedBudget = await budget.save();
    logger.info('Budget updated successfully:', updatedBudget);

    res
      .status(200)
      .json({ message: 'Budget updated successfully', updatedBudget });
  } catch (err) {
    logger.error('Error updating budget:', err.message);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

/**
 * @route   DELETE /api/budget/:id
 * @desc    Permanently delete an existing budget record
 */
router.delete('/:id', requireAuth, async (req, res) => {
  logger.info(`DELETE /api/budget/${req.params.id} - Deleting budget`);
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      logger.warn(`Budget not found for id: ${req.params.id}`);
      return res.status(404).json({ error: 'Budget not found' });
    }

    if (budget.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: 'Not authorized to delete this budget' });
    }

    const deletedBudget = await Budget.findByIdAndDelete(req.params.id);

    logger.info('Budget deleted successfully:', deletedBudget);
    return res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (err) {
    logger.error('Error deleting budget:', err.message);
    return res.status(500).json({ error: 'Failed to delete budget' });
  }
});

export default router;
