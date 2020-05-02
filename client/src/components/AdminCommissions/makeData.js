import namor from 'namor'

const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {

  return {
    order_created_at: namor.generate({ words: 1, numbers: 0 }),
    order: namor.generate({ words: 1, numbers: 0 }),
    product_type: namor.generate({ words: 1, numbers: 0 }),
    product_title: namor.generate({ words: 2, numbers: 0 }),
    vendor: namor.generate({ words: 1, numbers: 0 }),
    commissions_amount: Math.floor(Math.random() * 3),
    commissions_paid: Math.floor(Math.random() * 2) === 1 ? "Paid" : "Not Paid",
  }
}

export default function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
