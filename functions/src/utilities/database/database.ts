import * as admin from "firebase-admin";

class Database {
  private firestore: admin.firestore.Firestore;

  constructor(firestore: admin.firestore.Firestore) {
    this.firestore = firestore;
  }

  // Create a document
  async create(collectionPath: string, data: any): Promise<string> {
    const docRef = await this.firestore.collection(collectionPath).add(data);
    return docRef.id;
  }

  // Read a document by ID
  async readById(
    collectionPath: string,
    documentId: string
  ): Promise<any | undefined> {
    const docRef = this.firestore.collection(collectionPath).doc(documentId);
    const snapshot = await docRef.get();

    if (snapshot.exists) {
      return snapshot.data();
    } else {
      return undefined;
    }
  }

  // Read documents based on a provided condition
  async readByCondition(
    collectionPath: string,
    condition: (query: admin.firestore.Query) => admin.firestore.Query
  ): Promise<any[]> {
    const collectionRef = this.firestore.collection(collectionPath);
    const query = condition(collectionRef);

    const snapshot = await query.get();
    const documents: any[] = [];

    snapshot.forEach((doc) => {
      documents.push(doc.data());
    });

    return documents;
  }

  // Update a document
  async update(
    collectionPath: string,
    documentId: string,
    data: any
  ): Promise<void> {
    const docRef = this.firestore.collection(collectionPath).doc(documentId);
    await docRef.update(data);
  }

  // Delete a document
  async delete(collectionPath: string, documentId: string): Promise<void> {
    const docRef = this.firestore.collection(collectionPath).doc(documentId);
    await docRef.delete();
  }
}

export { Database };
