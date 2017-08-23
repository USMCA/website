/*******************************************************************************
 *
 * Normalizr schema.
 *
 ******************************************************************************/

import { schema } from 'normalizr';

export const subjectsSchema = new schema.Entity('subjects', {}, {
  idAttribute: 'subject_id'
});

