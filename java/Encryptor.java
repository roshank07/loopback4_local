import java.util.Base64;

public class Encryptor {
    public static void main(String[] args) {
        if (args.length < 2) {
            System.err.println("Usage: java Encryptor <publicKey> <data>");
            return;
        }
        String publicKey = args[0];
        String data = args[1];

        // Simulate encryption (here, encoding with Base64 for simplicity)
        String encryptedData = Base64.getEncoder().encodeToString((data + publicKey).getBytes());
        System.out.println(encryptedData);
    }
}
