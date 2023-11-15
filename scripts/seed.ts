import { PrismaClient } from '@prisma/client';
import { promisify } from 'util';
import crypto from 'crypto';

const pkdf2 = promisify(crypto.pbkdf2);

const prisma = new PrismaClient();

interface PasswordData {
	hash: string;
	salt: string;
}

async function makePassword(password: string): Promise<PasswordData> {
	const salt = crypto.randomBytes(32).toString('hex');
	const hash = (await pkdf2(password, salt, 1000, 100, 'sha512')).toString('hex');

	return { hash, salt };
}

async function main() {
	const org = await prisma.organization.findFirst({ where: { id: 1 } });

	if (org && org.name != 'Cardboard') {
		throw new Error(
			'Organization with id 1 already exists and is not Cardboard. Are you sure this is the right database?'
		);
	}

	console.log('Seeding database...');

	await prisma.organization.upsert({
		where: { id: 1, name: 'Cardboard' },
		update: {},
		create: {
			name: 'Cardboard',
            owner: {
                create: {
                    firstName: 'Card',
                    lastName: 'Board',
                    username: 'cardboard',
                    email: 'leader@card.board',
                    ...await makePassword('password')
                }
            },
            orgUsers: {
                create: {
                    user: {
                        create: {
                            firstName: "Brick",
                            lastName: "Stone",
                            username: "brickstone",
                            email: "bstone@card.board",
                            ...await makePassword("password"),
                            clubs: {
                                create: [
                                    {
                                        name: "Cardboard Club",
                                        organization: {
                                            connect: {
                                                id: 1
                                            }
                                        }
                                    },
                                    {
                                        name: "Board Game Club",
                                        organization: {
                                            connect: {
                                                id: 1
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
		}
	});

	console.log('Database seeded!');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
