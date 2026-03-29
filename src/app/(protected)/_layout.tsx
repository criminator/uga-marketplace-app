import { DarkTheme, LightTheme } from "@/constants/theme";
import { useAppContext } from "@/context/app-context";
import { Redirect, Slot } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import { PaperProvider, useTheme } from "react-native-paper";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const activeTheme = colorScheme === "dark" ? DarkTheme : LightTheme;
    useTheme();

    const { isAuthenticated } = useAppContext();

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/landing" />;
    }

    return (
        <PaperProvider theme={activeTheme}>
            <Slot />
        </PaperProvider>
    );
}
