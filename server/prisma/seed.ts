import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'jonh.doe@gmail.com',
      avatarUrl: 'http://github.com/exodogurgel.png',
    }
  })

  const poll = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: 'BOL123',
      ownerId: user.id,

      Participants: {
        create: {
          userId: user.id,
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: "2022-11-02T12:00:00.489Z",
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    }
  })

  await prisma.game.create({
    data: {
      date: "2022-11-03T12:00:00.489Z",
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: poll.id,
              }
            }
          }
        }
      }
    }
  })
}

main()