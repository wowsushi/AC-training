var should = chai.should()

describe('Test result of function fizzBuzz', function() {
  it('it should return Fizz if divisible by 3', function() {
    var result = fizzBuzz(18)
    result.should.be.equal('Fizz')
  })

  it('it should return Buzz if divisible by 5', function() {
    var result = fizzBuzz(25)
    result.should.be.equal('Buzz')
  })

  it('it should return FizzBuzz if divisible by 3 and 5', function() {
    var result = fizzBuzz(30)
    result.should.be.equal('FizzBuzz')
  })

  it('it should return original integer if can\'t divisible by 3 or 5', function() {
    var result = fizzBuzz(2)
    result.should.be.equal(2)
  })

})
