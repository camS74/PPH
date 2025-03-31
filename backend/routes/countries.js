import express from 'express';
import { getCountries, addCountry, deleteCountry } from '../controllers/countriesController.js';

const router = express.Router();

router.get('/', getCountries);
router.post('/', addCountry);
router.delete('/:id', deleteCountry);

export default router;