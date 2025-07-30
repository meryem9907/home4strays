import nodemailer from "nodemailer";
import { getSecret } from "./secret-manager";

/**
 * Configures and exports an SMTP transporter for sending admin emails.
 * This transporter is initialized with secure connection settings and
 * authenticates using secrets retrieved from the secret manager.
 */
export const adminMailTransporter = nodemailer.createTransport({
  /**
   * SMTP host server for email communication.
   * This is the mail server address for the organization.
   */
  host: "mail.obco.pro",
  /**
   * Port number for SMTP communication.
   * Port 587 is commonly used for TLS-encrypted email submissions.
   */
  port: 587, // 587
  /**
   * Indicates whether to use secure (TLS/SSL) connections.
   * Set to false since we're using STARTTLS via port 587.
   */
  secure: false,
  /**
   * Authentication credentials for the SMTP server.
   * These are retrieved securely from the secret manager.
   */
  auth: {
    /**
     * SMTP username for authentication.
     * Retrieved from the "EMAIL" secret.
     */
    user: getSecret("EMAIL"),
    /**
     * SMTP password for authentication.
     * Retrieved from the "EMAIL_PASSWORD" secret.
     */
    pass: getSecret("EMAIL_PASSWORD"),
  },
});

/**
 * Gracefully handles process termination signals.
 * Ensures the email transporter is properly closed before exiting.
 */
process.on("SIGTERM", async () => {
  /**
   * Closes the email transporter connection.
   * This ensures all pending email operations are completed.
   */
  await adminMailTransporter.close();
  process.exit(0);
});

/**
 * Processes the email queue when the transporter is idle.
 * Continuously checks for pending emails to send.
 */
adminMailTransporter.on("idle", async () => {
  console.log("Mail idling");
  /**
   * Continuously process emails while the transporter is idle.
   * This ensures emails are sent as soon as the transporter is available.
   */
  while (adminMailTransporter.isIdle()) {
    /**
     * Retrieve the next email from the queue.
     * If the queue is empty, exit the processing loop.
     */
    const message = MailQueue.queue.pop();
    if (!message) return; // queue is empty

    try {
      /**
       * Attempt to send the email using the transporter.
       * This will handle the actual email sending operation.
       */
      await adminMailTransporter.sendMail(message);
    } catch (err) {
      /**
       * If sending fails, re-add the email to the queue for retry.
       * Log the error for debugging purposes.
       */
      MailQueue.queue.push(message);
      console.error("❌  Failed to send", err);
    }
  }
});

/**
 * Interface defining the operations for a generic queue implementation.
 * This provides a contract for queue-related methods.
 */
interface IQueue<T> {
  /**
   * Adds an item to the end of the queue.
   * @param item - The item to be added to the queue.
   */
  push(item: T): void;
  /**
   * Removes and returns the item from the beginning of the queue.
   * @returns The item removed from the queue, or undefined if empty.
   */
  pop(): T | undefined;
  /**
   * Returns the number of items currently in the queue.
   * @returns The size of the queue.
   */
  size(): number;
}

/**
 * Implementation of a generic queue data structure.
 * This provides a FIFO (First-In-First-Out) mechanism for managing items.
 */
class Queue<T> implements IQueue<T> {
  /**
   * Internal array used to store queue items.
   */
  private storage: T[] = [];

  /**
   * Constructs a new queue with an optional maximum capacity.
   * @param capacity - Maximum number of items the queue can hold (default is Infinity).
   */
  constructor(private capacity: number = Infinity) {}

  /**
   * Adds an item to the end of the queue.
   * If the capacity is reached, the item is not added.
   * @param item - The item to be added to the queue.
   */
  push(item: T): void {
    if (this.capacity !== Infinity && this.size() >= this.capacity) {
      throw new Error("Queue is full");
    }
    this.storage.push(item);
  }

  /**
   * Removes and returns the item from the beginning of the queue.
   * @returns The item removed from the queue, or undefined if empty.
   */
  pop(): T | undefined {
    return this.storage.shift();
  }

  /**
   * Returns the number of items currently in the queue.
   * @returns The size of the queue.
   */
  size(): number {
    return this.storage.length;
  }

  /**
   * Clears all items from the queue.
   */
  clear(): void {
    this.storage = [];
  }
}

/**
 * Interface defining the structure of an email message.
 * This provides a contract for email-related data.
 */
interface Mail {
  /**
   * Sender email address.
   */
  from: string;
  /**
   * Recipient email address.
   */
  to: string;
  /**
   * Subject line of the email.
   */
  subject: string;
  /**
   * HTML content of the email.
   * Can contain binary data for attachments.
   */
  html: string | NonSharedBuffer;
}

/**
 * Singleton class managing the email queue.
 * This provides a centralized location for pending email messages.
 */
class MailQueue {
  /**
   * Static singleton instance of the email queue.
   * This ensures a single shared queue across the application.
   */
  public static queue: Queue<Mail> = new Queue();
}

export async function sendMail(message: Mail) {
  try {
    /**
     * Attempt to send the email using the transporter.
     * This will handle the actual email sending operation.
     */
    await adminMailTransporter.sendMail(message);
  } catch (err) {
    /**
     * If sending fails, re-add the email to the queue for retry.
     * Log the error for debugging purposes.
     */
    MailQueue.queue.push(message);
    console.error("❌  Failed to send", err);
  }
}

export { MailQueue };
