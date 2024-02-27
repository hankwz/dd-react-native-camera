import { useCallback, useState } from "react";
import { View } from "react-native";
import styles from './styles';
import {
    Camera,
    useCameraDevice,
    useCodeScanner
  } from 'react-native-vision-camera';

export const QRScannerScreen = () => {
    const [cameraActive, setCameraActive] = useState(true);

    const validateQRCode = useCallback(async (code: string) => {
        return false;
    }, []);

    const onRead = useCallback(
        (qrCode: any) => {
            // Unmount Camera
            setCameraActive(false);
            validateQRCode(qrCode)
                .then(validationSucceeded => {
                    if (!validationSucceeded) {
                        throw Error('INVALID_CODE');
                    }
                })
                .catch(e => {
                    const isInvalidCode = e.message === 'INVALID_CODE';
                    if (isInvalidCode) {
                        console.log('Error validating QR code', e);
                    }
                    setCameraActive(true);
                });
        },
        [validateQRCode]
    );

    const device = useCameraDevice('back');
    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: scan => {
            onRead(scan);
        }
    });

    return (
        <View style={styles.defaultScreen}>
        {cameraActive && (
            <Camera
              device={device}
              isActive
              codeScanner={codeScanner}
              style={{flex: 1, width: '100%', height:'100%', backgroundColor: 'green'}}
            />
          )}
          {!cameraActive && (
            <View
              style={{
                flex: 1,
                width: '100%',
                height:'100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black'
              }}
            />
          )}
        </View>
    );
}