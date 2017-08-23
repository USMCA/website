/*******************************************************************************
 *
 * Constants between server and frontend.
 *
 ******************************************************************************/

module.exports = {
  requestTypes: {
    REQUEST: 'request',
    ACCEPT: 'accept',
    REJECT: 'reject'
  },
  requestEnum: {
    REQUEST: 'request',
    INVITE: 'invite'
  },
  difficultyEnum: {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
  },
  userTypeEnum: {
    ADMIN: 'admin',
    DIRECTOR: 'director',
    CZAR: 'czar',
    MEMBER: 'member',
    TEST_SOLVER: 'test_solver'
  }
};

