# CSCI 4050/6050: SWE

## Dependencies

```
java 21.0.2-tem
expo 55
```

## For clean standalone development build

android:

```bash
npx expo prebuild --clean
npx expo run:android --variant release
```

ios:

```bash
# placeholder
```

## Known compatibility issues and pitfalls

- Compile using `java 21.0.2-tem`

```bash
sdk install java 21.0.2-tem   # install Temurin 21
sdk use java 21.0.2-tem        # switch to it
```

- debug/production SHA1 should match the `OAuth 2.0 Client IDs` configs on Google Cloud Console

```bash
# Emulator SHA1: grab the debug variant SHA1
$ ./gradlew signingReport
```

- (This is for requests to go through properly if using an emulator) For cleartext HTTP on Android, add it directly in AndroidManifest.xml since the app.json key isn't supported. After prebuild, open `android/app/src/main/AndroidManifest.xml` and add:

```xml
<application
    android:usesCleartextTraffic="true"
    ...>
```

## Important flag

```
%%%%%%%%%%%%%%%% VALIDATE UGA EMAIL DOMAIN %%%%%%%%%%%%%%%%
```
