import React, { useState } from "react";
import {
  TextInput,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axiosInstance from "../../axiosInstance";
// import { BASE_URL } from "@env";
import { useNavigation } from "@react-navigation/native";

const SearchFilter = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const makeDescriptionShorter = (desc, maxLength = 55) => {
    if (!desc) {
      return "No description provided.";
    }
    const newDescription = desc.substring(0, maxLength);
    return newDescription.length < desc.length
      ? newDescription + "..."
      : newDescription;
  };

  const searchItems = async (searchQuery) => {
    if (!searchQuery || searchQuery.length <= 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      // const endpoint = `${BASE_URL}/api/v1/recipe/search`;

      const response = await axiosInstance.get("/api/v1/recipe/search", {
        params: { query: searchQuery },
      });

      if (response.data && response.data.data) {
        setResults(response.data.data);
      } else {
        console.warn("Aucune donnée trouvée dans la réponse.");
        setResults([]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setQuery(text);
    searchItems(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={24} color="#fba922" />
        <TextInput
          placeholder="Rechercher des recettes..."
          value={query}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={results}
          scrollEnabled={false}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({ item }) => (
            <Pressable
              style={{ ...styles.resultItem }}
              onPress={() => navigation.navigate("RecipeDetail", { item })}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text>{makeDescriptionShorter(item.description)}</Text>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : null}
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyMessage}>Aucun résultat trouvé</Text>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  searchContainer: {
    backgroundColor: "white",
    elevation: 7,
    flexDirection: "row",
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: "center",
  },
  searchInput: {
    paddingLeft: 8,
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  resultItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "rgba(108,214,183,1)",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 8,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 16,
    color: "#999",
  },
});

export default SearchFilter;
