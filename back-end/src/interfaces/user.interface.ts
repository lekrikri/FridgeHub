export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    profilePictureUrl?: string;
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
    weight?: number;
    height?: number;
    preferences?: IUserPreferences;
}

export interface IUnitUser extends IUser {
    id: string;
    favoriteRecipes?: string[];
    createdRecipes?: string[];
    savedRecipes?: string[];
    preferences?: IUserPreferences; 
    weight?: number;
    height?: number;
}

export interface IUsers {
    [key: string]: IUnitUser;
}

export interface IUserPreferences {
    dietaryRestrictions?: string[];
    favoriteCuisines?: string[];
    cookingSkillLevel?: 'beginner' | 'intermediate' | 'advanced';
}