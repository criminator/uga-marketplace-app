import { getProductById, type ProductDTO } from "@/api/endpoints/products";
import { getUserById } from "@/api/endpoints/users";
import { ThemedText } from "@/components/themed-text";
import { TextVariants } from "@/constants/typography";
import { useAppContext } from "@/context/app-context";
import type { UserDTO } from "@/context/app-context";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Appbar, Divider, Surface, TouchableRipple } from "react-native-paper";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CAROUSEL_HEIGHT = 260;

export default function ProductDetailScreen() {
    const { colors } = useAppTheme();
    const router = useRouter();
    const { id, productName: initialName } = useLocalSearchParams<{
        id: string;
        productName: string;
    }>();
    const { user } = useAppContext();

    const [product, setProduct] = useState<ProductDTO | null>(null);
    const [seller, setSeller] = useState<UserDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        getProductById(id)
            .then(async (p) => {
                setProduct(p);
                if (user) {
                    try {
                        const s = await getUserById(p.sellerId, user.token);
                        setSeller(s);
                    } catch {
                        // seller contact info unavailable
                    }
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id, user]);

    const handleSellerPress = () => {
        if (!product) return;
        router.push({
            pathname: "/(protected)/user/[id]",
            params: { id: product.sellerId },
        } as any);
    };

    return (
        <Surface style={styles.screen} elevation={0}>
            <Appbar.Header>
                <Appbar.Content
                    title={product?.productName ?? initialName ?? "Product"}
                    titleStyle={{ fontWeight: "bold" }}
                />
                <Appbar.Action icon="close" onPress={() => router.back()} />
            </Appbar.Header>

            <Divider />

            {loading ? (
                <ActivityIndicator animating size="large" style={styles.loader} />
            ) : product ? (
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Description */}
                    {product.productDescription ? (
                        <Surface elevation={0} style={styles.fieldBlock}>
                            <ThemedText
                                variant={TextVariants.label_lg}
                                style={{ color: colors.onSurfaceVariant }}
                            >
                                Description:
                            </ThemedText>
                            <ThemedText variant={TextVariants.body_md}>
                                {product.productDescription}
                            </ThemedText>
                        </Surface>
                    ) : null}

                    {/* Price */}
                    <Surface elevation={0} style={styles.inlineRow}>
                        <ThemedText
                            variant={TextVariants.label_lg}
                            style={{ color: colors.onSurfaceVariant }}
                        >
                            Price:
                        </ThemedText>
                        <ThemedText
                            variant={TextVariants.subtitle_sm}
                            style={{ color: colors.primary }}
                        >
                            ${product.price.toFixed(2)}
                        </ThemedText>
                    </Surface>

                    {/* Image carousel */}
                    {product.productImages.length > 0 && (
                        <Surface elevation={0} style={styles.carouselWrapper}>
                            <FlatList
                                data={product.productImages}
                                keyExtractor={(_, i) => String(i)}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={(e) => {
                                    setActiveIndex(
                                        Math.round(
                                            e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
                                        ),
                                    );
                                }}
                                renderItem={({ item }) => (
                                    <Image
                                        source={{ uri: item }}
                                        style={styles.carouselImage}
                                        resizeMode="cover"
                                    />
                                )}
                            />
                            {product.productImages.length > 1 && (
                                <Surface elevation={0} style={styles.dots}>
                                    {product.productImages.map((_, i) => (
                                        <View
                                            key={i}
                                            style={[
                                                styles.dot,
                                                {
                                                    backgroundColor:
                                                        i === activeIndex
                                                            ? colors.primary
                                                            : colors.outlineVariant,
                                                },
                                            ]}
                                        />
                                    ))}
                                </Surface>
                            )}
                        </Surface>
                    )}

                    <Divider style={styles.divider} />

                    {/* Condition */}
                    <Surface elevation={0} style={styles.inlineRow}>
                        <ThemedText
                            variant={TextVariants.label_lg}
                            style={{ color: colors.onSurfaceVariant }}
                        >
                            Condition:
                        </ThemedText>
                        <ThemedText variant={TextVariants.body_md}>
                            {product.condition}
                        </ThemedText>
                    </Surface>

                    {/* Category */}
                    <Surface elevation={0} style={styles.inlineRow}>
                        <ThemedText
                            variant={TextVariants.label_lg}
                            style={{ color: colors.onSurfaceVariant }}
                        >
                            Category:
                        </ThemedText>
                        <ThemedText variant={TextVariants.body_md}>
                            {product.category}
                        </ThemedText>
                    </Surface>

                    {/* Seller name — clickable link */}
                    <Surface elevation={0} style={styles.inlineRow}>
                        <ThemedText
                            variant={TextVariants.label_lg}
                            style={{ color: colors.onSurfaceVariant }}
                        >
                            Seller:
                        </ThemedText>
                        <TouchableRipple onPress={handleSellerPress} borderless>
                            <ThemedText
                                variant={TextVariants.body_md}
                                style={{
                                    color: colors.primary,
                                    textDecorationLine: "underline",
                                }}
                            >
                                {product.sellerName}
                            </ThemedText>
                        </TouchableRipple>
                    </Surface>

                    {/* Seller email */}
                    {seller?.email ? (
                        <Surface elevation={0} style={styles.inlineRow}>
                            <ThemedText
                                variant={TextVariants.label_lg}
                                style={{ color: colors.onSurfaceVariant }}
                            >
                                Email:
                            </ThemedText>
                            <ThemedText variant={TextVariants.body_md}>
                                {seller.email}
                            </ThemedText>
                        </Surface>
                    ) : null}

                    {/* Seller mobile */}
                    {seller?.mobileNumber ? (
                        <Surface elevation={0} style={styles.inlineRow}>
                            <ThemedText
                                variant={TextVariants.label_lg}
                                style={{ color: colors.onSurfaceVariant }}
                            >
                                Phone:
                            </ThemedText>
                            <ThemedText variant={TextVariants.body_md}>
                                {seller.mobileNumber}
                            </ThemedText>
                        </Surface>
                    ) : null}
                </ScrollView>
            ) : (
                <Surface elevation={0} style={styles.loader}>
                    <ThemedText
                        variant={TextVariants.body_md}
                        style={{ color: colors.onSurfaceVariant }}
                    >
                        Product not found.
                    </ThemedText>
                </Surface>
            )}
        </Surface>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        padding: 16,
        gap: 12,
    },
    fieldBlock: {
        gap: 4,
    },
    inlineRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    carouselWrapper: {
        marginHorizontal: -16,
    },
    carouselImage: {
        width: SCREEN_WIDTH,
        height: CAROUSEL_HEIGHT,
    },
    dots: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
        paddingTop: 8,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },
    divider: {
        marginVertical: 4,
    },
});
