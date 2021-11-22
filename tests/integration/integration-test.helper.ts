import { getConnection } from 'typeorm';
import { mockSql } from '../__mockdata__/mock.sql';

export const beforeEachHelper = async () => {
  // Fetch all the entities
  const entities = getConnection().entityMetadatas;

  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name); // Get repository
    await repository.delete(() => ''); // Clear each entity table's content
  }
  await getConnection().manager.query(mockSql);
};
