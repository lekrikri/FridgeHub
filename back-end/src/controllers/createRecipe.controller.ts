import asyncHandler from 'express-async-handler';
import { OpenAI } from 'openai';
import { Request, Response, NextFunction } from 'express';
import Ingredient from '../models/ingredient.model';
import Recipe from '../models/recipe.model';
import dotenv from 'dotenv';


dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

async function getIngredientsByName(ingredientNames: string[]) {
    return Promise.all(ingredientNames.map(async (name: string) => {
        const ingredient = await Ingredient.findOne({ name: new RegExp(name, 'i') });
        if (!ingredient) throw new Error(`Ingrédient nommé ${name} non trouvé`);
        return String(ingredient._id);
    }));
}

export const generateRecipe = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { ingredients: ingredientNames } = req.body;
            const ingredientIds = await getIngredientsByName(ingredientNames);

            const gptResponseTitle = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a chef helping to create recipes based on given ingredients.',
                    },
                    {
                        role: 'user',
                        content: `Je suis un chef cuisinier. J'ai dans mon garde-manger les ingrédients suivants : ${ingredientNames.join(', ')}. Quel serait un bon titre pour une recette en utilisant ces ingrédients ?`,
                    }
                ],
                max_tokens: 120,
                temperature: 0.7
            });

            const recipeTitle = gptResponseTitle.choices[0]?.message?.content?.trim();
            if (!recipeTitle || recipeTitle.length < 3) {
                throw new Error("Titre de recette non généré de manière adéquate.");
            }

            const gptResponseDescription = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a chef helping to create recipes based on given ingredients.',
                    },
                    {
                        role: 'user',
                        content: `Je suis un chef cuisinier. Écrire une courte description pour une recette appelée "${recipeTitle}".`,
                    }
                ],
                max_tokens: 300,
                temperature: 0.7
            });

            const recipeDescription = gptResponseDescription.choices[0]?.message?.content?.trim();
            if (!recipeDescription || recipeDescription.length < 3) {
                throw new Error("Description de recette non générée de manière adéquate.");
            }

            const gptResponseSteps = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a chef helping to create recipes based on given ingredients.',
                    },
                    {
                        role: 'user',
                        content: `Je suis un chef cuisinier prêt à cuisiner un plat appelé "${recipeTitle}" avec les ingrédients suivants: ${ingredientNames.join(', ')}. Pouvez-vous me fournir des instructions de préparation détaillées, étape par étape ?`,
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            });

            const stepsText = gptResponseSteps.choices[0]?.message?.content?.trim();
            if (!stepsText || stepsText.length < 10) {
                throw new Error("Les instructions de la recette n'ont pas été générées de manière adéquate. Veuillez réessayer.");
            }

            const steps = stepsText.split('\n').filter(line => line.trim() !== '').map((step, index) => ({
                title: `Étape ${index + 1}`,
                instructions: step.trim(),
            }));
            if (steps.length === 0) {
                throw new Error("Les étapes de la recette n'ont pas été générées correctement. Veuillez réessayer.");
            }

            const difficultyLevels = ['Facile', 'Moyen', 'Difficile'];
            const difficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
            const kcal = Math.round(Math.random() * 200 + 300);

            const recipe = new Recipe({
                title: recipeTitle,
                totalTime: steps.length * 10 || 30,
                rating: 0,
                image: 'https://i.ibb.co/0QJKtrt/toque-chef.png',
                description: recipeDescription,
                kcal: kcal,
                difficulty: difficulty,
                steps: steps,
                ingredients: ingredientIds.map(id => ({ ingredient: id, quantity: 'Inconnue', metric: 'Inconnue' })),
            });

            const savedRecipe = await recipe.save();
            res.status(201).json({ success: true, data: savedRecipe });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Erreur lors de la création de la recette : ${error.message}`);
                res.status(500).json({
                    success: false,
                    message: `Erreur serveur : ${error.message}`,
                });
            } else {
                console.error(`Erreur inattendue : ${error}`);
                res.status(500).json({
                    success: false,
                    message: 'Une erreur inattendue s\'est produite.',
                });
            }
        }
    }
);
