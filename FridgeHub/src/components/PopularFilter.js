import React from "react";
import { Image, Pressable, Text, View, FlatList } from "react-native";
import { colors, recipleList } from "../Constant";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import chronocook from "../../assets/images/choronocook.png";

const PopularFilter = () => {
  const navigation = useNavigation();
  const makeDescriptionShorter = (desc, maxLength = 50) => {
    if (!desc) {
      return "No description provided.";
    }
    const words = desc.split(" ");
    const formattedWords = words.map((word, index) =>
      index % 5 === 4 ? word + "\n" : word
    );
    const newDescription = formattedWords.join(" ");
    if (newDescription.length > maxLength) {
      return newDescription.substring(0, maxLength) + "...";
    } else {
      return newDescription;
    }
  };

  return (
    <View
      style={{
        paddingTop: 32,
      }}
    >
      <Text
        style={{
          paddingHorizontal: 16,
          fontSize: 22,
          fontWeight: "bold",
          color: "#2A4859",
        }}
      >
        Favoris
      </Text>
      <FlatList
        paddingLeft={16}
        data={recipleList}
        horizontal
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => navigation.navigate("Recipe", { item: item })}
            style={{
              backgroundColor: index % 2 == 0 ? "#2CD9BE" : "#FCA721",
              shadowColor: "darkgrey",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.8,
              shadowRadius: 8,
              borderRadius: 16,
              marginVertical: 16,
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 10,
              marginRight: 66,
              marginTop: 40,
              height: 130,
              width: 240,
            }}
          >
            <Image
              source={item.image}
              style={{
                position: "absolute",
                right: -40,
                top: -40,
                width: 130,
                height: 130,
              }}
            />
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "900",
                alignSelf: "flex-start",
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 13,
                fontWeight: "400",
                alignSelf: "flex-start",
                letterSpacing: -0.85,
              }}
            >
              {makeDescriptionShorter(item.description)}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 13 }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginRight: 100 }}>
                  <Text
                    style={{ fontWeight: 700, color: "white", fontSize: 18 }}
                  >
                    {item.time}
                  </Text>
                  <Image
                    source={chronocook}
                    style={{
                      width: "150%",
                      height: "150%",
                      resizeMode: "contain",
                      position: "absolute",
                      left: 40,
                      top: -9,
                    }}
                  />
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ marginRight: 4, color: "black", fontSize: 20 }}>
                  {item.rating}
                </Text>
                <FontAwesome
                  name="star"
                  size={20}
                  color={colors.COLOR_LIGHT}
                  style={{ top: 3 }}
                />
              </View>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default PopularFilter;
