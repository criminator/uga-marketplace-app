import { makeRedirectUri } from "expo-auth-session";
import { useAuthRequest } from "expo-auth-session/providers/google";
import { maybeCompleteAuthSession } from "expo-web-browser";
maybeCompleteAuthSession();

const ANDROID_CLIENT_ID =
    "249897655210-40op90hv70rvf3hi5j9r64io3ivscca0.apps.googleusercontent.com";
const IOS_CLIENT_ID =
    "249897655210-sag9kcv24299mjrj73e3ok70omr72u5n.apps.googleusercontent.com";
const WEB_CLIENT_ID =
    "249897655210-6242ghh083u25loq9lgdc625g7ovucre.apps.googleusercontent.com";

export function useGoogleAuth() {
    const [request, response, promptAsync] = useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        webClientId: WEB_CLIENT_ID,
        redirectUri: makeRedirectUri({ scheme: "ugamarketplace" }),
        scopes: ["openid", "email", "profile"],
        responseType: "id_token",
    });

    return { request, response, promptAsync };
}
