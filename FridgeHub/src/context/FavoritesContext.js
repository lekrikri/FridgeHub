import React, {createContext, useState, useEffect, useContext} from 'react';
import axiosInstance from '../../axiosInstance';
import {AuthContext} from "./AuthContext";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext); // Assurez-vous que AuthContext est importé

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/v1/favorite', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.success) {
                const favoriteData = response.data.data;

                const recipeDetailsPromises = favoriteData.map((favorite) =>
                    axiosInstance
                        .get(`/api/v1/recipe/${favorite.recipeId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                        .catch((err) => {
                            console.error("Failed to fetch recipe details: ", err);
                            return null;
                        })
                );

                const recipesDetails = await Promise.all(recipeDetailsPromises);

                const combinedFavorites = favoriteData
                    .map((favorite, index) => ({
                        ...favorite,
                        recipe: recipesDetails[index]?.data?.data || {},
                    }))
                    .filter((fav) => fav.recipe);

                setFavorites(combinedFavorites);
                setError(null); // Réinitialiser l'erreur après une récupération réussie
            } else {
                setError("Erreur lors de la récupération des favoris.");
            }
        } catch (err) {
            console.error("Failed to fetch favorites: ", err);
            setError("Failed to load favorites. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [token]);

    return (
        <FavoritesContext.Provider value={{ favorites, setFavorites, fetchFavorites, loading, error }}>
            {children}
        </FavoritesContext.Provider>
    );
};
