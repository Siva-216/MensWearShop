import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import io.github.cdimascio.dotenv.Dotenv;

public class MongoTest {
    public static void main(String[] args) {
        try {
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
            String uri = dotenv.get("MONGODB_URI");
            if (uri == null) {
                System.out.println("MONGODB_URI not found in .env");
                return;
            }
            System.out.println("Connecting to: " + uri.split("@")[1]); // Hide password
            
            try (MongoClient mongoClient = MongoClients.create(uri)) {
                MongoDatabase database = mongoClient.getDatabase("fashionworld");
                System.out.println("Ping result: " + database.runCommand(new org.bson.Document("ping", 1)));
                System.out.println("SUCCESS: Connected to MongoDB!");
            }
        } catch (Exception e) {
            System.out.println("FAILURE: Could not connect to MongoDB");
            e.printStackTrace();
        }
    }
}
