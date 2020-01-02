import faker from "faker";
import { Sequelize } from "sequelize-typescript";

testaaa()
    .then(() => {
        console.log(">>>>>>>>>>>>>>: done", 0);
    }).catch((err: any) => {
        console.log(">>>>>>>>>>>>>>: err", err.stack);
});

async function testaaa() {
    const end = 1;
}

async function createProduct(quantities: number) {
    const sequelize = new Sequelize({
        "url": "postgres://postgres:123123@127.0.0.1:5432/test",
        "logging": true
    });

    while (quantities > 0) {
        const data: string[] = [];
        for (let ii = 0; ii < 2000 && ii < quantities; ii++) {

            let firstName = faker.name.firstName();
            firstName = firstName.replace("'", "");
            // @ts-ignore
            const price = faker.finance.amount(100, 1000) * 1000;
            // const quantities = faker.random.number(1000);
            data.push(`('${firstName}', ${price}, ${faker.random.number(1000)})`);
            console.log(">>>>>>>>>>>>>>: gen data: ", ii);
        }
        sequelize.query(`insert into products ("name", "price", "quantities") values ${data.join(",")}`)
            .then(() => {
                console.log(">>>>>>>>>>>>>>: done");
            })
            .catch((err: any) => {
                console.log(">>>>>>>>>>>>>>: err", err.stack);
            });

        quantities = quantities - 2000;
    }
}
