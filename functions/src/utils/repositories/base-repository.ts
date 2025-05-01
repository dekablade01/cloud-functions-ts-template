import { Firestore, Query, DocumentData } from 'firebase-admin/firestore';

export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findOne(query: Partial<T>): Promise<T | null>;
  find(query: Partial<T>): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

export abstract class FirestoreRepository<T extends { id: string }> implements Repository<T> {
  protected abstract collectionName: string;

  constructor(protected firestore: Firestore) {}

  protected collection() {
    return this.firestore.collection(this.collectionName);
  }

  async findById(id: string): Promise<T | null> {
    const doc = await this.collection().doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } as T : null;
  }

  async findOne(query: Partial<T>): Promise<T | null> {
    const results = await this.find(query);
    return results[0] || null;
  }

  async find(query: Partial<T>): Promise<T[]> {
    let firestoreQuery: Query<DocumentData> = this.collection();

    // Build query
    Object.entries(query).forEach(([field, value]) => {
      firestoreQuery = firestoreQuery.where(field, '==', value);
    });

    const snapshot = await firestoreQuery.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  }

  async create(data: Partial<T>, id?: string): Promise<T> {
    if (id) {
      await this.collection().doc(id).set(data);
      const doc = await this.collection().doc(id).get();
      return { id: doc.id, ...doc.data() } as T;
    } else {
      const docRef = await this.collection().add(data);
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as T;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    await this.collection().doc(id).update(data);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Document not found after update');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.collection().doc(id).delete();
  }
} 