import React, { useState } from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "https://images01.nicepage.com/a1389d7bc73adea1e1c1fb7e/f625e3501ea153e0acad867f/pexels-photo-9668543.jpeg",
    },
    {
      id: 2,
      name: "Jane Smith",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "https://plus.unsplash.com/premium_photo-1672373830660-4655ca9de6c3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFsZSUyMG9mZmljZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 3,
      name: "Alex Johnson",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALcAwwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAFAAMEBgcBAgj/xABDEAABAwIDBQQHBgUCBQUAAAABAAIDBBEFEiEGIjFBURMyYXEHFFKBkaGxI0LB0eHwFSRicoKS8TNDU6LCFzRUY2T/xAAZAQADAQEBAAAAAAAAAAAAAAAAAQMCBAX/xAAjEQEBAAMBAAEEAwEBAAAAAAAAAQIDESESBCIxQTJRYXET/9oADAMBAAIRAxEAPwDUimZQnzwTMiYDqlma4Qyqp+PkjMyHVZ4+S1AAGku558V4fS6P81OLnWemnu3XrbKDJSaNUP1XU7yKTO0Z5KK12rkwaZS/1KRHS/Zu3konaBD8e2ghwanO6JKiTVjCbWHUlK3h86cqfV6UZqmdsbfHioD8Ww9hOWV7zbgGqqyYtUV8plnnID9OGUeQXHzPbH2TC2Rp68R7woZbb3xSa1xjrKGZgyzMa9zbhubinDG248lUI4v5VjakNaB3JBfd89VLw7GHUc8dLXSukieNyY2I+moWsdnbyllhID49pico8UOU7G3XxOUniSoCr4m6uJJIDqsuwRy4pKf6VWlaNgW3xCc9GoC8Nk0O7yTUk2WJSAxpdfwTUsX2Z80AMqKt2buqJPUuuN1EZadpcCo00LQ9ARBVut3UlJ7BvspIDYCmZFKYztTZSo6CLTOL+9SbAnhQastbG9W8UNL/ANFqaqMKoaiMxyQix6Ego6GaOq2jMOhTElU3s3byf2mw2LDcVqKeFzzECHC/IEXsg0zdx6pL1mpsk8ZDd7kosczbHeUR7Xbvko8bXAEdVohZ1VFDA+SR4DGi7ieSziqxAVtZNUvYXvldftDyA4Nb0srDtCJYsHmy598tabeJCG7O4GcQc0MNnnqNLLn3Z8V14ocT3yANlizEjd0upkUD+zPq+a/Nmpy+5Wml2NqmXZII3stx6+6y9T7PU8TWspZw+qdp2cZzZfMLkubp+CnvlqImdlNFeI8nOykeV1FdGOzcxrHPiJ1Y77p6+C0Wh2Mlke0zvaGjiMo1+AU+u2epoKR0bY2jQi+VHzOYMknjy8SS9mlzxtyUdGsTgip55ohuvZofEWuEEXbpy+WLk2YzGkkkkqpuq2+j0/zlR/aqkrb6PdamrPRoQF2YdV6k7vvXI3NuuzvbkHmgIs3NQZe+pk0jdd5RXSR5jvckA3dJeTNH7SSA2WA5TdEY3Xjv4oW1+VPMr2MDc+bQm6i2ILqhfxSk5vynnouSYxh0YzSVLW28D+SOhR9qw2XHal3s5R8ggtRFHZyKYvUxVWK1M8bszHybp6jQBQZ2t3lXGeM1EdE3Kd3kmYYW2O6iDQ2w8lHhLdUyRq6hdV0E0FOzNI5u6PFBNiIZG1zmPGUxi+Xx4firnhjWOmecjXFjcwDuov8Aou0+HMhxeWZwjzTRi5j4E8L/ACC4997k69OP29GaKWNptmaPC6Jdgx0d2tbqbqrYphVaf/YRUpa65LpY83yHimsKw2upJS98rGAi5ZEwhl78hfooSLftbuysyyD4tuRPTeNz10cEUVA7flbmzOvZvDoquyhxN0wZWwMqO0JvL2z7jhY2Jt1+CAoW073fxaqk6uDPgAgque2UDKHCGQtPfrDe/UN4/C3xVLXZo/g5d/8APjqS4krxF6Vr2CLu1qfJVPkrh6PhpWfvkgljzSXXh/bOFvFTWMXsDVAB56eY33lBfTSOktmVkmy2UFxbmKDB/UHLqKiSwC6gNaco840UkpqXgpmFztvc9EMro3Pajr2NIKjer9qQPNOCq9HTL0+nytJRZ9HvPa3iEPxuKWKhe+PitsoDm7p8lFiDd7e5oVUVNZbvclCZJWPB3kBaaSYwVAe0+HmpwqWT1GaCLIxtgeGp4mypLTWMabyWGvuRvYrERX0j3uN8s7ow7roCD8Fz78ZZ1bTlZ5V/pMr2e5N15bE0Na25Kj0j+zdbqvOIV9Aw9jVnXjlMTjfx4Lldk9vDVdma+kc/uk6J2u7OOAutYkXQqWvwrt4nsnLnA2aLOI+i8YxXiOlkeSQ2OMk3+X78Vn/GsvtjLNtMXZiWIthgN4aa7b9Xk3cflb3FV1epCXPc4m5JJJXhejjj8Zx52V7k6uheV1aZdKt+wRysqz++Cp5Vt2IdlgqvP8E4FvEugSEmqgGpa0rz682+jdUEmTOUR7tT5KPNiDrndUOSslNyG6IAkDoPJdQsVdRbupIDdXKPM+wUh6hVJ0Km0YfUtjzBMsr4ospc5Qa92UEoHXVG6nBVj/ikPaPcHcVBxzEIX0bmB2tlVzUOQTGsbigd2QJlm5sHAeZW4yL1D2/JAq7HaSjJiGaaUfcYdB5nkgNdU1dabzS2ZyiBs0BQ3wi2rA3oRqqTD+2bRGv2hlrqX1eODss+kjg++nQaBH/RnVxmefDJXZO2+0iI0s8DX32HwBVNjYdb8VMw0yU8zJ4XFksbg5jhxDhqEbNUyx4MM7jl1tMVQ6mkbBWmz77rwNHIlJSR1zN94uNQ4aEIVhNbTbRYRFM5jM5GWRh+64cR8U4YqmBpZT1JDP8A7AHLycpyvSxv7jtTh0NJGZny5zxDnuvZUHaTGW1Xb01O8lkROc8y5WLFsQdFFK+rqM0MLC5wGguFi0sklTJLVOO/K8vJ6XN7KujX8sup79l5ynnm7ifFcTLXucePvToK7vjXF8o6kuLqy0R4K07Gtc6mqPNVY8Fatj3ZaOfzTgGxBvHyT0MI0zJls2rlxk7kEn+rx+ym3wR7yajlddeZHuzlFMg1oAHRJRnO1SSDbnqDVcCpsnBD6x2iwYLiBbcqv12XKEXxWcMvmVVr6+NgG9zTAXtTiJoKZracgTTXa13sjmfnp4nwVUpGHNmJLidTfipe1FUKmuYRwZFp8Smqdpia0/dIuQr4p07O3NHoNBqRzUJxsAWm4NrtRMjPHu9Pkhkw7NxB4B1r/wBJ1B+q2y5E3ecWnccBbw4r3JiFPALXc/8Atbz81HhDWyZJNWScB4qW6Nndc1o8NEwMbH7UDDJqqaeSOKmIbeJz95xvbMNNbcxxtrawK0F2OUdTSiWJ+69mZulrhY5UUrLfZjKeg1C8U9fPQtfEZS+Fze5cgMPUdPdx1C5dmjt6vhuuM40ymwx+04e3Oz1FsuWdmfK5w42GunEaqZV+i7DKkMdT1RpABYsi1Dv9V7FQ/R7s1KMIdX4g60lc0OjjDuDNSCfP8leqOmipIgY8OEbCfvvAJXJcrhlzGuqTHPHtjNqr0T1DJD6tisLmcu0iP1B/BVjaXZTENmmxyVboZYZXFrJYX6XtexBFxz+BW6VdRvMY3DKkgkkyxEHL87qDj9CzG9nq6l7OOUyRO7PtG2LHgXafMGyrh9Rl3lSz0Y87Hz2DZdTIJuLgg9CnV0Zcvsc8/p0qy7NPyUMo6uVZPBGsGeWULw3m5EMd7bfO8kyob7SE2mee8nI6aR57yKByKqjy95NvrI2uKjQUO5q7VI0jbOSBt+INzFcXg08dzupID6Ck4IZWjj5IlJwQ2uOiwap4zFnDt5U+tpm5ldMWPeVQrnASEnu80wpmKua6tlDe6zd+HFEo2Nb2bf6UCz9q+R33nOJPv1RijkzwN8AF04zxJ77NzTZptzaeii1QbJcAWzNIt4jX8D8UQztUCubkrKWRmmd+Vw66WToQoBngcebNR9U/VP8As45Rw5+9eaMdnVSsPDVMVz8kRjHIpfoJEh3DZc2ewSq2kxltFTsJiBHbvvYMbfW56nl+hT2BYdPjldDQUg+0kNy7kxvNx/fGwW+bOYHRYLh8dPRRZWN5kXc88yfFQ37ZPIrqwuV7U2goW00bG7pLWgaC1vAKXNAyVgaQeNx1CcsG6uchGP7R4bgdMZ6+qjjaO6Halx6Acz4BcXOuu+PWICopYXmnnL5LaCUXF+mmqHYXVvq6EzVVOIJ2OcyRjTcXHME8uaz+s29hxnE6UQ9uXOcTFAN1rXW4vPM2vw0V7pJx/DhEAS8jUHiSeJU7LjfW5ZlPHz7iAbHitXGxoa1tRIA0DgA4ryEV2rwqSjxzFJGtBjZUAuJ4jOC6/lo4X/MIU031+q9GXuMcFntJ3BH8FH8if7kAcjmESNjoCOrkATYNXL1EdW+aimqaxpTba9qAsETt13ko7n6HyUGOv+yKYfX5QT4JBI7TUpIT6/fVJAfS0nBDK7gUTk4IXXDQrJqtjB1d5qh45M5kE/g0j6rQ66PO52bgqXtJTsdG9hG6d0pz8i/hQKfQW80Vw+IiLM42JuWoZ2D4pnxON3BwAPXojjGaBp0aNAOq6okgSU07iXPmkPk9RZ2PikilMjnBj25mu5ao4GtZ91RMUiZLTP8AatoiwzMto8Qa4G4eOKHTB9VWdlEwvkc4Ma1ouXE8AB1uU4KozQwvzb0brFaD6LNl3Oqv4zWx97Wla4cB7fv5eHmo7NkxjeGFyq37AbLs2ewprZMr8QqLGeQcujQeg+pV0uyniJ5ALxBG1jUG2wxiLCMGqayTuwsuB7Tjo0fFef25312eYRSPSD6QKrD6x2H4S+MVDQDLMdRF0FuvP/e4ybEKuqrpnTVk808tzvyOzfouySSVMss87s0sri97uribkpiXQW6rvw1zHFx5Z3LIw1743Nkj3XsOYHxWr7N+kXDWUETcXfUMqGNs89nmDvEEfisxw+MGvpWOsQ6ZgI46FwW0Rej3Zuro2vfSPjkIvmimcLa34Xt8lHdMe+qavlzxW9q8XwnGMGxWswxmaX7FjnE2I37at53udfzWeNV/2y2Ui2fwKc4XJMYZJIzUB5DszW3A1tpqb/7BZ+0+FvAJ6rLj4WyWZevR4KZTPcILZlCJUiM/ZBUYOue72kmuTJckw6oAlC7cTc/BKnO6uVB0SCITquryeKSQfVMnBDax2hRGbgguJOc0OSMGxOVrAVn+1lQbgN5uRfabEJYb5XKjVdbLUyDtHaJkjyOLquH2tNff+aJPIEjQ1C6ltgJRxbw+I/JTWyjJ2h4O4eK6Nf4Yy/KU53+yF4jXNsYIjneONuS7K6WX7NrnNae87m7wHReoMOy2Jdccmt0W7O+M9H/R/sTNi7ziGJNLMOvmbHe3akf+K2zDqVkLBZoaANGgWsq16NJmVGzjac96mkLD1sdWn4G3uVte9rGLyt1vz5XfqmPx8KebKMqyX0qYhUYpiEGz+GtdK9g7edjXDjY5RqbdT8FfMexaHCsNqcQqCQyJpsBxcfDxvYL58qq+oq8RqK+WR7aidxc5zDbjyv0toqaMO3rG3Pk4ZAtpaybIzOITv3SuRt3Su/jkP4HH2mP0EPWZp+Gq+hKM2pWjoAsH2Ph7Xaemdyjvbzt+q3aJ32Q8lw/VX7nXoniDtFRtxDC6mmcLiSNzPj+7rASx0bix4s5ps4dCvoeY5o3DwWLbX00bcarXQ8BJc+ZAJ+d1P6XLtsb+onkqvuUhh+yCjE31T2a0IPRddcrpK61yjOqde6vPrDvZSApDLay9yHOhQqpF31yZATS3VJQfXH8+KSOB9Zz8ECxQ7rkcn4IFivdcsmzraChrsSqHQUFNJUP6Ri9vM8B7yhEGwuMktM/qcFx3XVAcR/puPmtZqIo6fZwSRNyEhrnEcyVXIptUUKBtRs1UYLhsdVJUxTAzNY5kYOgIPP3fNB6dzREXO1ybrfE/v8VoW3EsLNlqs1AvnyiMf15tPha/xWbUpMjWj7vH38/xVtVTyFKGEkds4X9nwHX9+CntZfio2GTNkpMp7zbi30/fgnXy306Lria4ej3EPVcYfTF32dQyx/ubqPldX6pmzPytPAalYfTVrqGtp6gHWKQOt1F9R7wr1tbtbDhWEZ6WQOqahn2Q6X+95D9F531Wvux16M5MFV9KG0Ir69uF0rrwUpvLbg5/TyF/ifBUOPVzvIfivTi573Pe4ue43cXcSfFSaKGlljqn1NQ6J0cZMLAwntX6Wb4fr4FWwx+M4lll8r0yRu+9cldkjI6r0dwKPIc2Yrdvif7WHYyaOPGKPNuteS0O6uIWzxu3W+S+esNnc0FoJ0cHDXgf2FdqDbDFvUhE7I8t0zuG8FzbtWW37sXRq2zX5V7x7GIcNonuc/NM67Y2dT+iympc6Vz5ZTmLiST16qRU1NRVSmaqlzSHjmP4IdW1DRGY2HTmVTVpmnH/AFnZt/8ATIM5L28fYBNlPkfy/wDikSCI80tr2unxR/1Jh92uBZxTrRVv7rJD5ArPYclp9lA0/wDMThoI265nKL9sz/iiZv8AiV5L2O0Mr/8AK6Uv+tX/AIl+qN5Okt4JLtPhGJ1ULZqSIyQu7ruvJJaZfVE3BAcW7rkem4IDi/ccs0FXa7LO8I2fRUymfexV0qN7Zecf/nH0WeQVTI7vkkY0AXNzYBIBnpMncMMw+Id10xcfc39VTsNOUZX8b6I/tbiDcafTw0MM08cBJ7VjCWucbaCw14II2irg4H1Kr06wOAHyV8J4xklwOdDaRh829U+6obILgZT7J4qA6V8RLXAtdzvxum+0c592i7uBHVX+XifD81SGk5rj+4FD6qY1UgcXONhlbfkByHgpX8Irq1+dgia3g0EnT5IhR7HYlUyNhic1z3d0MYXE/GylcutSAN9w3XYxljt1N1em+i3F7gTv72m4Bw694qyReiDDuxHbYtVum+8W5A0e4i/zS6fGQPKZkNmEdVs//pFQfdrpn/3foVx3oppWcg7+4u/FHRxi9PdrtNHW0U2nqJgCGvs7notcb6NaeLX1dn+NvyXiT0eUj/8AiUsth7L7fRZmXKdjLhJLLlbnLy7QNA4+4J44Ji07gI8PltyuA36lajQ7F4fQuzxUkvaDm9ziibYKeDQtd7mEn6LOebeGMZPBsVjlRYGnijP9co/C6N0vo4xSSHLLV0kVxyzP+oC0NlRHHoIXEf4/mpkNU9wAZTOd46/kfqoXZYr8Iy+o9H2IYbD2lOXVrz3g1gbp4bxQ2bDq+lH8xQVcdtCXQOsPeBZbiwB7RmFjbUdE6I2qGf3Xrp124zj5+7RhJY9zcw+7ddcyJ434mu9wW+S4fSVLS2emgmaeIkjDvqEPn2K2enFzhdNGTzhBjP8A22UbitNgDsti2E0GAUdNmhYWMOZptoSST8yVxEnejnZ1xJyVYvyFW+w+aStM657qlXRrWu7wun2UNJJrJTMff2hdJJdGTlxSW0tNHHkFPEGeyGC30TcsEMbR2ULGdMrQEklj9tA2MRh8W91Vcko4nk5o2ldSXRgnUCq2dwmqdeehgkd1ey5+KZZsxhER+zw6nB/sCSS0yksw6mibaOnjbbo0K5YXhENFADExoc4AudzPgkknAlGJy8GPwSSTDyY2+yvOUcrj/JJJIO2d/wBRyV3+38guJIBFzhxEZ8woP8Rpxifqb4t8tBuOAKSSKFTxvaGGlxb1akZJNiDtGQMkLG2/qOg+qMUdRUGiikq5Iy8mzy1ptmvYgBJJRsUlT3RyNfkBvbUG/H5L0+J9xu88veSSS+MP5V0snaHOy2a3p7vFDH4zJ/y6cgc3zPFvcBcpJKW77cfFdft9NHHHf/LaPBtPp8ykkkubq7//2Q==",
    },
    {
        id: 4,
        name: "Alex Johnson",
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image: "https://media.istockphoto.com/id/2003613572/photo/smiling-bearded-man-in-glasses-at-a-casual-business-meeting.webp?a=1&b=1&s=612x612&w=0&k=20&c=E6AxIWxGEEqdXFxRCpWM77mFqrv19U2gV11mCnljs3g=",
      },
  ];

  const [current, setCurrent] = useState(0); // Start with the first testimonial

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);  // Move to the right

  };

  const handleNext = () => {
// Move to the left
    setCurrent((prev) => (prev + 1) % testimonials.length % testimonials.length);
  };

  // Reorder testimonials based on current index
  const reorderedTestimonials = [
    testimonials[(current + 0) % testimonials.length],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  return (
    <div className="bg-gray-100 py-10">
      <div className="lg:text-3xl text-2xl text-lightblue font-bold max-w-5xl mx-auto mb-20">OUR TESTIMONIALS</div>
      <h1 className="h-2 w-10 lg:w-16 bg-lightblue ml-2 lg:ml-44 -mt-24  lg:-mt-16"></h1>
      <div className="flex justify-center items-center">
        {/* Left Arrow */}
        <button
          onClick={handleNext}
          className="text-gray-600 hover:text-gray-800 p-4 bg-gray-200 rounded-full focus:outline-none mx-4"
        >
          &#8592;
        </button>

        {/* Testimonials */}
        <div className="flex items-center gap-12 mt-32">
          {reorderedTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`relative transition-all duration-1000 ease-in-out flex flex-col items-center bg-white shadow-md p-6 rounded-lg
                ${index === 1
                  ? "scale-110 opacity-100 h-86 w-72 transform shadow-xl transition-transform" // Center block larger with a smooth transition
                  : "scale-90 opacity-60 w-64 transform transition-transform"}`} // Non-center blocks smaller
            >
              {/* Overlapping Image */}
              <div
                className={`absolute -top-10 flex justify-center items-center w-24 h-24 rounded-full overflow-hidden border-4 ${index === 1 ? "border-lightgreen" : "border-gray-200"}`}
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className={`object-cover w-full h-full ${index === 1 ? "scale-110" : "scale-100"}`} // Larger image for center block
                />
              </div>
              <div className="text-5xl text-lightblue mt-4 lg:mt-10 ml-0  lg:-ml-56 ">“</div>
              <p className="text-lightblue font-bold mb-1 ">{testimonial.name}</p>
              <p className="text-gray-600 max-w-7xl text-center">{testimonial.text}</p>
              <div className="text-5xl text-lightblue ml-0 lg:ml-56 mt-2">”</div>

            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handlePrev}
          className="text-gray-600 hover:text-gray-800  p-4 bg-gray-200 rounded-full focus:outline-none mx-4"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default Testimonials;
