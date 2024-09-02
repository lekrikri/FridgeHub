import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";

const EditableField = ({ label, value, onChange, isEditing, unit }) => {
	const [tempValue, setTempValue] = useState(value);

	const handleBlur = () => {
		onChange(tempValue);
	};

	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				padding: 8,
			}}
		>
			<Text style={{ fontWeight: "bold" }}>{label}</Text>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				{isEditing ? (
					label === "Cooking Skill Level" ? (
						<Picker
							selectedValue={value}
							onValueChange={onChange}
							style={{ height: 50, width: 150 }}
						>
							<Picker.Item label="Beginner" value="beginner" />
							<Picker.Item
								label="Intermediate"
								value="intermediate"
							/>
							<Picker.Item label="Advanced" value="advanced" />
						</Picker>
					) : (
						<TextInput
							style={{
								color: "#2A4859",
								fontWeight: "400",
								textAlign: "right",
								backgroundColor: "#E0F1EB",
								width: 80,
								height: 25,
								borderRadius: 5,
								borderColor: "#2CD9BE",
								borderWidth: 0.2,
								marginRight: 4,
							}}
							value={tempValue}
							onChangeText={setTempValue}
							onBlur={handleBlur}
						/>
					)
				) : (
					<Text
						style={{
							color: "#2A4859",
							fontWeight: "500",
							marginRight: 4,
						}}
					>
						{value}
					</Text>
				)}
				{unit && (
					<Text
						style={{
							textAlign: "right",
							color: "#2A4859",
							fontWeight: "500",
							minWidth: 25,
						}}
					>
						{unit}
					</Text>
				)}
			</View>
		</View>
	);
};

export default EditableField;
