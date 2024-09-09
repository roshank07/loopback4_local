import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<String> inputs = new ArrayList<>();

        while (scanner.hasNextLine()) {
            String input = scanner.nextLine();
            if (input.isEmpty()) {
                break; // End input on an empty line
            }
            inputs.add(input);
        }
        scanner.close();

        System.out.println("My name is:" + inputs.get(0) + " "+ inputs.get(1));

    }
}
