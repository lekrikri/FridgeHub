import React from 'react';
import {ScrollView, Text, View} from "react-native";
import {categories, colors} from "../Constant";

const CategoriesFilter = () => {
    return (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {
                    categories.map((category, index) => {
                        return (
                            <View key={category.id} style={{
                                backgroundColor: index === 0 ?colors.COLOR_PRIMARY: colors.COLOR_LIGHT,
                                marginRight: 36,
                                elevation: 7,
                                borderRadius: 8,
                                paddingHorizontal: 16,
                                paddingVertical: 15,
                                shadowColor: "#000",
                                shadowOffset: {width: 0, height: 5},
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                marginVertical: 16,
                            }}>
                                <Text style={{color: index === 0 && colors.COLOR_LIGHT, fontSize: 18,  }}>{category.category}</Text>
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>
    );
};

export default CategoriesFilter;