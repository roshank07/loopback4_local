import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class Encryptor {
    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/ECB/PKCS5Padding";

    public static void main(String[] args) throws Exception {
        if (args.length < 2) {
            System.err.println("Usage: java Encryptor <publicKeyPath> <data>");
            System.exit(1);
        }

        String publicKeyPath = args[0];
        String data = args[1];

        // Load the public key
        PublicKey publicKey = loadPublicKey(publicKeyPath);

        // Generate AES key
        SecretKey aesKey = generateAESKey();

        // Encrypt data with AES key
        byte[] encryptedData;
        try {
            encryptedData = encryptDataWithAES(data, aesKey);
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting data with AES", e);
        }

        // Encrypt AES key with public key
        byte[] encryptedAESKey = encryptAESKeyWithPublicKey(aesKey, publicKey);

        // Format the response as XML
        String xmlResponse = formatAsXML(encryptedData, encryptedAESKey);

        // Print the XML response
        System.out.println(xmlResponse);

    }

    private static PublicKey loadPublicKey(String publicKeyPath) throws Exception {
        String key = new String(Files.readAllBytes(Paths.get(publicKeyPath)))
                .replaceAll("-----BEGIN PUBLIC KEY-----", "")
                .replaceAll("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");
        byte[] keyBytes = Base64.getDecoder().decode(key);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(spec);
    }

    private static SecretKey generateAESKey() throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256); // AES-256
        return keyGen.generateKey();
    }

    private static byte[] encryptDataWithAES(String data, SecretKey aesKey) throws Exception {
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.ENCRYPT_MODE, aesKey);
        return cipher.doFinal(data.getBytes());
    }

    private static byte[] encryptAESKeyWithPublicKey(SecretKey aesKey, PublicKey publicKey) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        return cipher.doFinal(aesKey.getEncoded());
    }

    private static String formatAsXML(byte[] encryptedData, byte[] encryptedAESKey) {
        String encryptedDataStr = Base64.getEncoder().encodeToString(encryptedData);
        String encryptedAESKeyStr = Base64.getEncoder().encodeToString(encryptedAESKey);

        return "<EncryptionResult>" +
                "<EncryptedData>" + encryptedDataStr + "</EncryptedData>" +
                "<EncryptedAESKey>" + encryptedAESKeyStr + "</EncryptedAESKey>" +
                "</EncryptionResult>";
    }
}
