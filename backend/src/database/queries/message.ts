import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import Message from "../../models/db-models/message";

/**
 * Class containing database query operations for Message entities
 * Provides static methods to interact with the Message table in the database
 */
class MessageQueries {
  /**
   * Retrieves all messages from the database
   * Executes a SELECT query on the Message table and returns the results
   *
   * @param db - DatabaseManager instance used to execute the query
   * @returns Promise resolving to an array of Message objects
   *
   * @description
   * This method fetches all records from the Message table, including:
   * - id: Unique identifier for the message
   * - sender: Identifier of the message sender
   * - recipient: Identifier of the message recipient
   * - content: The message content text
   * - timestamp: Datetime when the message was created
   *
   * The results are automatically converted from database rows to Message class instances
   * using class-transformer's plainToInstance method
   */
  static async select(db: DatabaseManager): Promise<Message[]> {
    const result = (
      await db.executeQuery(`
          SELECT id, sender, recipient, content, timestamp FROM Message;
        `)
    ).rows;
    return plainToInstance(Message, result);
  }
}

export { MessageQueries };
