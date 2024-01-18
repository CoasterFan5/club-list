import { prisma } from "$lib/server/prismaConnection"

export const load = async({params}) => {
    const orgUserData = await prisma.orgUser.findMany({
        where: {
            organizationId: parseInt(params.id)
        },
        include: {
            user: true
        }
    })

    const filteredData = orgUserData.map((item) => {
        return {
            user: {
                firstName: item.user.firstName,
                lastName: item.user.lastName,
                pfp: item.user.pfp,
                role: item.role
            },
            role: item.role
        }
    })

    return {
        orgUserData: filteredData
    }


}