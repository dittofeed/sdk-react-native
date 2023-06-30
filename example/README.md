# Example

```
yarn expo prebuild
```


## Android

```
cd android/ && ./gradlew assembleDebug
```

`/android/build.gradle`

```
buildscript {
  dependencies {
    // ... other dependencies
    classpath 'com.google.gms:google-services:4.3.15'
    // Add me --- /\
  }
}
```

## ios

```
cd ios/ && pod install
```