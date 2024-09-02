import axios from 'axios';
import Clarifai from 'clarifai';
import { knownIngredients } from '../data/ingredients';
import { Alert } from 'react-native';

// Initialisez l'API Clarifai
const CLARIFAI_API_KEY = '500bbcdac63142e4844c75e193b2657e'
const CLARIFAI_URL = 'https://api.clarifai.com/v2/models/';

export const recognizeIngredientsInImage = async (base64Image) => {
    try {
        const response = await axios.post(
            `${CLARIFAI_URL}${Clarifai.GENERAL_MODEL}/outputs`,
            {
                inputs: [
                    {
                        data: {
                            image: {
                                base64: base64Image,
                            },
                        },
                    },
                ],
                model: {
                    output_info: {
                        output_config: {
                            language: "fr"
                        }
                    }
                }
            },
            {
                headers: {
                    Authorization: `Key ${CLARIFAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 200) {
            const concepts = response.data.outputs[0].data.concepts;
            const filtered = concepts.filter(concept => concept.value >= 0.80);
            const filteredConcepts = filtered.filter(concept => knownIngredients.includes(concept.name.toLowerCase()));

            // Trie les résultats par probabilité décroissante et limite à un certain nombre de résultats, par exemple 10
            filteredConcepts.sort((a, b) => b.value - a.value);
            const topConcepts = filteredConcepts.slice(0, 10);

            return topConcepts.map(concept => concept.name);
        } else {
            console.error('Erreur dans la réponse de l\'API Clarifai', response);
            throw new Error('Erreur dans la réponse de l\'API Clarifai');
        }
    } catch (error) {
        if (error.response) {
            // La requête a été faite et le serveur a répondu avec un code de status qui sort du range de 2xx
            console.error('Erreur lors de la requête à l\'API Clarifai', error.response.data);
            if (error.response.status === 402) {
                Alert.alert('Erreur', 'Votre quota gratuit a été dépassé.');
            }
        } else if (error.request) {
            // La requête a été faite mais aucune réponse n'a été reçue
            console.error('Erreur lors de la requête à l\'API Clarifai', error.request);
        } else {
            // Une erreur a été produite lors de la configuration de la requête
            console.error('Erreur lors de la requête à l\'API Clarifai', error.message);
        }
        throw error;
    }
};