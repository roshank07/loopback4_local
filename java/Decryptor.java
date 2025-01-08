import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class Decryptor {

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/ECB/PKCS5Padding";

    public static void main(String[] args) throws Exception {
        if (args.length < 2) {
            System.err.println("Usage: java Encryptor <publicKeyPath> <data>");
            System.exit(1);
        }

        String privateKeyPath = args[0];
        String encryptedInput = args[1];
        // Read the private key from the file
        PrivateKey privateKey = loadPrivateKey(privateKeyPath);

        // Parse the XML input to extract the encrypted AES key and encrypted data
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(new java.io.ByteArrayInputStream(encryptedInput.getBytes()));
        Element root = document.getDocumentElement();

        String encryptedDataStr = root.getElementsByTagName("EncryptedData").item(0).getTextContent();
        String encryptedAESKeyStr = root.getElementsByTagName("EncryptedAESKey").item(0).getTextContent();

        byte[] encryptedData = Base64.getDecoder().decode(encryptedDataStr);
        byte[] encryptedAESKey = Base64.getDecoder().decode(encryptedAESKeyStr);

        // Decrypt the AES key with the private key
        SecretKey aesKey = decryptAESKeyWithPrivateKey(encryptedAESKey, privateKey);

        // Decrypt the data with the AES key
        byte[] decryptedBytes = decryptDataWithAES(encryptedData, aesKey);

        // Print the decrypted response
        System.out.println(new String(decryptedBytes));
    }

    private static PrivateKey loadPrivateKey(String filePath) throws Exception {
        String key = new String(Files.readAllBytes(Paths.get(filePath)))
                .replaceAll("-----BEGIN PRIVATE KEY-----", "")
                .replaceAll("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");
        byte[] keyBytes = Base64.getDecoder().decode(key);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePrivate(spec);
    }

    private static SecretKey decryptAESKeyWithPrivateKey(byte[] encryptedAESKey, PrivateKey privateKey)
            throws Exception {
        Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        byte[] aesKeyBytes = cipher.doFinal(encryptedAESKey);
        return new SecretKeySpec(aesKeyBytes, ALGORITHM);
    }

    private static byte[] decryptDataWithAES(byte[] encryptedData, SecretKey aesKey) throws Exception {
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, aesKey);
        return cipher.doFinal(encryptedData);
    }
}
