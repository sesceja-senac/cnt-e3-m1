var
    J2000             = 2451545.0,              // Dia juliano da época
    JulianCentury     = 36525.0,                // Dias no século Juliano
    JulianMillennium  = (JulianCentury * 10),   // Dias no milênio juliano
    AstronomicalUnit  = 149597870.0,            // Unidade astronômica em quilômetros
    TropicalYear      = 365.24219878;           // Ano solar tropical médio

/*  ASTOR -- Segundos de arco para radianos. */

function astor(a)
{
    return a * (Math.PI / (180.0 * 3600.0));
}

/*  DTR -- Graus para radianos.  */

function dtr(d)
{
    return (d * Math.PI) / 180.0;
}

/* RTD -- Radianos para graus.  */

function rtd(r)
{
    return (r * 180.0) / Math.PI;
}

/* FIXANGLE -- O intervalo reduz o ângulo em graus.*/

function fixangle(a)
{
        return a - 360.0 * (Math.floor(a / 360.0));
}

/* FIXANGR -- O alcance reduz o ângulo em radianos.  */

function fixangr(a)
{
        return a - (2 * Math.PI) * (Math.floor(a / (2 * Math.PI)));
}

//  DSIN -- Seno de um ângulo em graus

function dsin(d)
{
    return Math.sin(dtr(d));
}

//  DCOS -- Cosseno de um ângulo em graus

function dcos(d)
{
    return Math.cos(dtr(d));
}

/*  MOD -- Função de módulo que funciona para números não inteiros. */

function mod(a, b)
{
    return a - (b * Math.floor(a / b));
}

// AMOD -- Função de módulo que retorna o numerador se o módulo for zero

function amod(a, b)
{
    return mod(a - 1, b) + 1;
}

/* JHMS -- Converte o tempo Juliano em horas, minutos e segundos,
              retornado como uma matriz de três elementos.  */

function jhms(j) {
    var ij;

    j += 0.5;  
    ij = ((j - Math.floor(j)) * 86400.0) + 0.5;
    return new Array(
                     Math.floor(ij / 3600),
                     Math.floor((ij / 60) % 60),
                     Math.floor(ij % 60));
}

// JWDAY -- Calcula o dia da semana a partir do dia Juliano

var Weekdays = new Array( "Domingo", "Segunda", "Terça", "Quarta",
                          "Quinta", "Sexta", "Sábado" );

function jwday(j)
{
    return mod(Math.floor((j + 1.5)), 7);
}

/*  OBLIQEQ -- Calcula a obliquidade da eclíptica para um dado
                 Dados juliana. Isso usa o décimo grau de Laskar
                 ajuste polinomial (J. Laskar, Astronomy and
                 Astrofísica, vol. 157, página 68 [1986]) que é
                 precisão de 0,01 segundo de arco entre AD 1000
                 e AD 3000, e dentro de alguns segundos de arco para
                 +/- 10.000 anos por volta de 2.000 DC. Se estivermos fora do
                 intervalo em que este ajuste é válido (deep time) nós
                 simplesmente retorne o valor J2000 da obliquidade, que
                 passa a ser quase precisamente a média.

*/

var oterms = new Array (
        -4680.93,
           -1.55,
         1999.25,
          -51.38,
         -249.67,
          -39.05,
            7.12,
           27.87,
            5.79,
            2.45
);

function obliqeq(jd)
{
    var eps, u, v, i;

    v = u = (jd - J2000) / (JulianCentury * 100);

    eps = 23 + (26 / 60.0) + (21.448 / 3600.0);

    if (Math.abs(u) < 1.0) {
        for (i = 0; i < 10; i++) {
            eps += (oterms[i] / 3600.0) * v;
            v *= u;
        }
    }
    return eps;
}

/* Termos periódicos para nutação em longitude (delta \Psi) e
   obliquidade (delta \Epsilon) conforme indicado na tabela 21.A de
   Meeus, "Algoritmos Astronômicos", primeira edição. */

var nutArgMult = new Array(
     0,  0,  0,  0,  1,
    -2,  0,  0,  2,  2,
     0,  0,  0,  2,  2,
     0,  0,  0,  0,  2,
     0,  1,  0,  0,  0,
     0,  0,  1,  0,  0,
    -2,  1,  0,  2,  2,
     0,  0,  0,  2,  1,
     0,  0,  1,  2,  2,
    -2, -1,  0,  2,  2,
    -2,  0,  1,  0,  0,
    -2,  0,  0,  2,  1,
     0,  0, -1,  2,  2,
     2,  0,  0,  0,  0,
     0,  0,  1,  0,  1,
     2,  0, -1,  2,  2,
     0,  0, -1,  0,  1,
     0,  0,  1,  2,  1,
    -2,  0,  2,  0,  0,
     0,  0, -2,  2,  1,
     2,  0,  0,  2,  2,
     0,  0,  2,  2,  2,
     0,  0,  2,  0,  0,
    -2,  0,  1,  2,  2,
     0,  0,  0,  2,  0,
    -2,  0,  0,  2,  0,
     0,  0, -1,  2,  1,
     0,  2,  0,  0,  0,
     2,  0, -1,  0,  1,
    -2,  2,  0,  2,  2,
     0,  1,  0,  0,  1,
    -2,  0,  1,  0,  1,
     0, -1,  0,  0,  1,
     0,  0,  2, -2,  0,
     2,  0, -1,  2,  1,
     2,  0,  1,  2,  2,
     0,  1,  0,  2,  2,
    -2,  1,  1,  0,  0,
     0, -1,  0,  2,  2,
     2,  0,  0,  2,  1,
     2,  0,  1,  0,  0,
    -2,  0,  2,  2,  2,
    -2,  0,  1,  2,  1,
     2,  0, -2,  0,  1,
     2,  0,  0,  0,  1,
     0, -1,  1,  0,  0,
    -2, -1,  0,  2,  1,
    -2,  0,  0,  0,  1,
     0,  0,  2,  2,  1,
    -2,  0,  2,  0,  1,
    -2,  1,  0,  2,  1,
     0,  0,  1, -2,  0,
    -1,  0,  1,  0,  0,
    -2,  1,  0,  0,  0,
     1,  0,  0,  0,  0,
     0,  0,  1,  2,  0,
    -1, -1,  1,  0,  0,
     0,  1,  1,  0,  0,
     0, -1,  1,  2,  2,
     2, -1, -1,  2,  2,
     0,  0, -2,  2,  2,
     0,  0,  3,  2,  2,
     2, -1,  0,  2,  2
);

var nutArgCoeff = new Array(
    -171996,   -1742,   92095,      89,          /*  0,  0,  0,  0,  1 */
     -13187,     -16,    5736,     -31,          /* -2,  0,  0,  2,  2 */
      -2274,      -2,     977,      -5,          /*  0,  0,  0,  2,  2 */
       2062,       2,    -895,       5,          /*  0,  0,  0,  0,  2 */
       1426,     -34,      54,      -1,          /*  0,  1,  0,  0,  0 */
        712,       1,      -7,       0,          /*  0,  0,  1,  0,  0 */
       -517,      12,     224,      -6,          /* -2,  1,  0,  2,  2 */
       -386,      -4,     200,       0,          /*  0,  0,  0,  2,  1 */
       -301,       0,     129,      -1,          /*  0,  0,  1,  2,  2 */
        217,      -5,     -95,       3,          /* -2, -1,  0,  2,  2 */
       -158,       0,       0,       0,          /* -2,  0,  1,  0,  0 */
        129,       1,     -70,       0,          /* -2,  0,  0,  2,  1 */
        123,       0,     -53,       0,          /*  0,  0, -1,  2,  2 */
         63,       0,       0,       0,          /*  2,  0,  0,  0,  0 */
         63,       1,     -33,       0,          /*  0,  0,  1,  0,  1 */
        -59,       0,      26,       0,          /*  2,  0, -1,  2,  2 */
        -58,      -1,      32,       0,          /*  0,  0, -1,  0,  1 */
        -51,       0,      27,       0,          /*  0,  0,  1,  2,  1 */
         48,       0,       0,       0,          /* -2,  0,  2,  0,  0 */
         46,       0,     -24,       0,          /*  0,  0, -2,  2,  1 */
        -38,       0,      16,       0,          /*  2,  0,  0,  2,  2 */
        -31,       0,      13,       0,          /*  0,  0,  2,  2,  2 */
         29,       0,       0,       0,          /*  0,  0,  2,  0,  0 */
         29,       0,     -12,       0,          /* -2,  0,  1,  2,  2 */
         26,       0,       0,       0,          /*  0,  0,  0,  2,  0 */
        -22,       0,       0,       0,          /* -2,  0,  0,  2,  0 */
         21,       0,     -10,       0,          /*  0,  0, -1,  2,  1 */
         17,      -1,       0,       0,          /*  0,  2,  0,  0,  0 */
         16,       0,      -8,       0,          /*  2,  0, -1,  0,  1 */
        -16,       1,       7,       0,          /* -2,  2,  0,  2,  2 */
        -15,       0,       9,       0,          /*  0,  1,  0,  0,  1 */
        -13,       0,       7,       0,          /* -2,  0,  1,  0,  1 */
        -12,       0,       6,       0,          /*  0, -1,  0,  0,  1 */
         11,       0,       0,       0,          /*  0,  0,  2, -2,  0 */
        -10,       0,       5,       0,          /*  2,  0, -1,  2,  1 */
         -8,       0,       3,       0,          /*  2,  0,  1,  2,  2 */
          7,       0,      -3,       0,          /*  0,  1,  0,  2,  2 */
         -7,       0,       0,       0,          /* -2,  1,  1,  0,  0 */
         -7,       0,       3,       0,          /*  0, -1,  0,  2,  2 */
         -7,       0,       3,       0,          /*  2,  0,  0,  2,  1 */
          6,       0,       0,       0,          /*  2,  0,  1,  0,  0 */
          6,       0,      -3,       0,          /* -2,  0,  2,  2,  2 */
          6,       0,      -3,       0,          /* -2,  0,  1,  2,  1 */
         -6,       0,       3,       0,          /*  2,  0, -2,  0,  1 */
         -6,       0,       3,       0,          /*  2,  0,  0,  0,  1 */
          5,       0,       0,       0,          /*  0, -1,  1,  0,  0 */
         -5,       0,       3,       0,          /* -2, -1,  0,  2,  1 */
         -5,       0,       3,       0,          /* -2,  0,  0,  0,  1 */
         -5,       0,       3,       0,          /*  0,  0,  2,  2,  1 */
          4,       0,       0,       0,          /* -2,  0,  2,  0,  1 */
          4,       0,       0,       0,          /* -2,  1,  0,  2,  1 */
          4,       0,       0,       0,          /*  0,  0,  1, -2,  0 */
         -4,       0,       0,       0,          /* -1,  0,  1,  0,  0 */
         -4,       0,       0,       0,          /* -2,  1,  0,  0,  0 */
         -4,       0,       0,       0,          /*  1,  0,  0,  0,  0 */
          3,       0,       0,       0,          /*  0,  0,  1,  2,  0 */
         -3,       0,       0,       0,          /* -1, -1,  1,  0,  0 */
         -3,       0,       0,       0,          /*  0,  1,  1,  0,  0 */
         -3,       0,       0,       0,          /*  0, -1,  1,  2,  2 */
         -3,       0,       0,       0,          /*  2, -1, -1,  2,  2 */
         -3,       0,       0,       0,          /*  0,  0, -2,  2,  2 */
         -3,       0,       0,       0,          /*  0,  0,  3,  2,  2 */
         -3,       0,       0,       0           /*  2, -1,  0,  2,  2 */
);

/*  NUTATION  -- Calcula a nutação em longitude, deltaPsi e
                  obliquidade, deltaEpsilon para uma determinada data Juliana
                  jd. Os resultados são retornados como uma matriz de dois elementos
                  dando (deltaPsi, deltaEpsilon) em graus.*/

function nutation(jd)
{
    var deltaPsi, deltaEpsilon,
        i, j,
        t = (jd - 2451545.0) / 36525.0, t2, t3, to10,
        ta = new Array,
        dp = 0, de = 0, ang;

    t3 = t * (t2 = t * t);

    /* Calcular ângulos. A correspondência entre os elementos
       da nossa matriz e os termos citados em Meeus são:
       ta[0] = D  ta[0] = M  ta[2] = M'  ta[3] = F  ta[4] = \Omega

    */

    ta[0] = dtr(297.850363 + 445267.11148 * t - 0.0019142 * t2 + 
                t3 / 189474.0);
    ta[1] = dtr(357.52772 + 35999.05034 * t - 0.0001603 * t2 -
                t3 / 300000.0);
    ta[2] = dtr(134.96298 + 477198.867398 * t + 0.0086972 * t2 +
                t3 / 56250.0);
    ta[3] = dtr(93.27191 + 483202.017538 * t - 0.0036825 * t2 +
                t3 / 327270);
    ta[4] = dtr(125.04452 - 1934.136261 * t + 0.0020708 * t2 +
                t3 / 450000.0);

    /* A faixa reduz os ângulos caso as funções seno e cosseno
       não faça isso com tanta precisão ou rapidez. */

    for (i = 0; i < 5; i++) {
        ta[i] = fixangr(ta[i]);
    }

    to10 = t / 10.0;
    for (i = 0; i < 63; i++) {
        ang = 0;
        for (j = 0; j < 5; j++) {
            if (nutArgMult[(i * 5) + j] != 0) {
                ang += nutArgMult[(i * 5) + j] * ta[j];
            }
        }
        dp += (nutArgCoeff[(i * 4) + 0] + nutArgCoeff[(i * 4) + 1] * to10) * Math.sin(ang);
        de += (nutArgCoeff[(i * 4) + 2] + nutArgCoeff[(i * 4) + 3] * to10) * Math.cos(ang);
    }

    /* Retorne o resultado, convertendo de dez milésimos de arco
       segundos para radianos no processo. */

    deltaPsi = dp / (3600.0 * 10000.0);
    deltaEpsilon = de / (3600.0 * 10000.0);

    return new Array(deltaPsi, deltaEpsilon);
}

/*  ECLIPTOEQ  --  Converter longitude celeste (eclíptica) e
                   latitude em ascensão reta (em graus) e
                   declinação. Devemos fornecer o tempo do
                   conversão para compensar corretamente o
                   variação da obliquidade da eclíptica ao longo do tempo.
                   A ascensão reta e a declinação são retornadas
                   como uma matriz de dois elementos nessa ordem. */

function ecliptoeq(jd, Lambda, Beta)
{
    var eps, Ra, Dec;

    /*Obliquidade da eclíptica. */

    eps = dtr(obliqeq(jd));
log += "Obliquity: " + rtd(eps) + "\n";

    Ra = rtd(Math.atan2((Math.cos(eps) * Math.sin(dtr(Lambda)) -
                        (Math.tan(dtr(Beta)) * Math.sin(eps))),
                      Math.cos(dtr(Lambda))));
log += "RA = " + Ra + "\n";
    Ra = fixangle(rtd(Math.atan2((Math.cos(eps) * Math.sin(dtr(Lambda)) -
                        (Math.tan(dtr(Beta)) * Math.sin(eps))),
                      Math.cos(dtr(Lambda)))));
    Dec = rtd(Math.asin((Math.sin(eps) * Math.sin(dtr(Lambda)) * Math.cos(dtr(Beta))) +
                 (Math.sin(dtr(Beta)) * Math.cos(eps))));

    return new Array(Ra, Dec);
}


/*  DELTAT  --  Determine a diferença, em segundos, entre
                Tempo dinâmico e tempo universal.  */

/* Tabela de valores Delta T observados no início de
    anos pares de 1620 a 2002. */

var deltaTtab = new Array(
    121, 112, 103, 95, 88, 82, 77, 72, 68, 63, 60, 56, 53, 51, 48, 46,
    44, 42, 40, 38, 35, 33, 31, 29, 26, 24, 22, 20, 18, 16, 14, 12,
    11, 10, 9, 8, 7, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10,
    10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13,
    13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16,
    16, 16, 15, 15, 14, 13, 13.1, 12.5, 12.2, 12, 12, 12, 12, 12, 12,
    11.9, 11.6, 11, 10.2, 9.2, 8.2, 7.1, 6.2, 5.6, 5.4, 5.3, 5.4, 5.6,
    5.9, 6.2, 6.5, 6.8, 7.1, 7.3, 7.5, 7.6, 7.7, 7.3, 6.2, 5.2, 2.7,
    1.4, -1.2, -2.8, -3.8, -4.8, -5.5, -5.3, -5.6, -5.7, -5.9, -6,
    -6.3, -6.5, -6.2, -4.7, -2.8, -0.1, 2.6, 5.3, 7.7, 10.4, 13.3, 16,
    18.2, 20.2, 21.1, 22.4, 23.5, 23.8, 24.3, 24, 23.9, 23.9, 23.7,
    24, 24.3, 25.3, 26.2, 27.3, 28.2, 29.1, 30, 30.7, 31.4, 32.2,
    33.1, 34, 35, 36.5, 38.3, 40.2, 42.2, 44.5, 46.5, 48.5, 50.5,
    52.2, 53.8, 54.9, 55.8, 56.9, 58.3, 60, 61.6, 63, 65, 66.6
                         );

function deltat(year)
{
    var dt, f, i, t;

    if ((year >= 1620) && (year <= 2000)) {
        i = Math.floor((year - 1620) / 2);
        f = ((year - 1620) / 2) - i;  /* Fractional part of year */
        dt = deltaTtab[i] + ((deltaTtab[i + 1] - deltaTtab[i]) * f);
    } else {
        t = (year - 2000) / 100;
        if (year < 948) {
            dt = 2177 + (497 * t) + (44.1 * t * t);
        } else {
            dt = 102 + (102 * t) + (25.3 * t * t);
            if ((year > 2000) && (year < 2100)) {
                dt += 0.37 * (year - 2100);
            }
        }
    }
    return dt;
}

/*  EQUINOX  --  Determine o dia das efemérides julianas de um
                 equinócio ou solstício. O argumento "qual"
                 seleciona o item a ser calculado:

                    0 equinócio de março
                    1º de junho solstício
                    2 de setembro equinócio
                    3 de dezembro solstício

*/

// Termos periódicos para obter o tempo real

var EquinoxpTerms = new Array(
                       485, 324.96,   1934.136,
                       203, 337.23,  32964.467,
                       199, 342.08,     20.186,
                       182,  27.85, 445267.112,
                       156,  73.14,  45036.886,
                       136, 171.52,  22518.443,
                        77, 222.54,  65928.934,
                        74, 296.72,   3034.906,
                        70, 243.58,   9037.513,
                        58, 119.81,  33718.147,
                        52, 297.17,    150.678,
                        50,  21.02,   2281.226,
                        45, 247.54,  29929.562,
                        44, 325.15,  31555.956,
                        29,  60.93,   4443.417,
                        18, 155.12,  67555.328,
                        17, 288.79,   4562.452,
                        16, 198.04,  62894.029,
                        14, 199.76,  31436.921,
                        12,  95.39,  14577.848,
                        12, 287.11,  31931.756,
                        12, 320.81,  34777.259,
                         9, 227.73,   1222.114,
                         8,  15.45,  16859.074
                             );

JDE0tab1000 = new Array(
   new Array(1721139.29189, 365242.13740,  0.06134,  0.00111, -0.00071),
   new Array(1721233.25401, 365241.72562, -0.05323,  0.00907,  0.00025),
   new Array(1721325.70455, 365242.49558, -0.11677, -0.00297,  0.00074),
   new Array(1721414.39987, 365242.88257, -0.00769, -0.00933, -0.00006)
                       );

JDE0tab2000 = new Array(
   new Array(2451623.80984, 365242.37404,  0.05169, -0.00411, -0.00057),
   new Array(2451716.56767, 365241.62603,  0.00325,  0.00888, -0.00030),
   new Array(2451810.21715, 365242.01767, -0.11575,  0.00337,  0.00078),
   new Array(2451900.05952, 365242.74049, -0.06223, -0.00823,  0.00032)
                       );

function equinox(year, which)
{
    var deltaL, i, j, JDE0, JDE, JDE0tab, S, T, W, Y;

    /* Inicialize os termos para equinócio médio e solstícios. Nós
        têm dois conjuntos: um para anos anteriores a 1000 e um segundo
        para os anos seguintes.
         */

    if (year < 1000) {
        JDE0tab = JDE0tab1000;
        Y = year / 1000;
    } else {
        JDE0tab = JDE0tab2000;
        Y = (year - 2000) / 1000;
    }

    JDE0 =  JDE0tab[which][0] +
           (JDE0tab[which][1] * Y) +
           (JDE0tab[which][2] * Y * Y) +
           (JDE0tab[which][3] * Y * Y * Y) +
           (JDE0tab[which][4] * Y * Y * Y * Y);

//document.debug.log.value += "JDE0 = " + JDE0 + "\n";

    T = (JDE0 - 2451545.0) / 36525;
//document.debug.log.value += "T = " + T + "\n";
    W = (35999.373 * T) - 2.47;
//document.debug.log.value += "W = " + W + "\n";
    deltaL = 1 + (0.0334 * dcos(W)) + (0.0007 * dcos(2 * W));
//document.debug.log.value += "deltaL = " + deltaL + "\n";

    //  Some os termos periódicos para o tempo T

    S = 0;
    for (i = j = 0; i < 24; i++) {
        S += EquinoxpTerms[j] * dcos(EquinoxpTerms[j + 1] + (EquinoxpTerms[j + 2] * T));
        j += 3;
    }

//document.debug.log.value += "S = " + S + "\n";
//document.debug.log.value += "Corr = " + ((S * 0.00001) / deltaL) + "\n";

    JDE = JDE0 + ((S * 0.00001) / deltaL);

    return JDE;
}

/*  SUNPOS  -- Posição do Sol. Por favor, veja os comentários
                na declaração de retorno no final desta função
                que descrevem o array que ele retorna. Nós voltamos
                valores intermediários porque são úteis em uma
                variedade de outros contextos.  */

function sunpos(jd)
{
    var T, T2, L0, M, e, C, sunLong, sunAnomaly, sunR,
        Omega, Lambda, epsilon, epsilon0, Alpha, Delta,
        AlphaApp, DeltaApp;

    T = (jd - J2000) / JulianCentury;
//document.debug.log.value += "Sunpos.  T = " + T + "\n";
    T2 = T * T;
    L0 = 280.46646 + (36000.76983 * T) + (0.0003032 * T2);
//document.debug.log.value += "L0 = " + L0 + "\n";
    L0 = fixangle(L0);
//document.debug.log.value += "L0 = " + L0 + "\n";
    M = 357.52911 + (35999.05029 * T) + (-0.0001537 * T2);
//document.debug.log.value += "M = " + M + "\n";
    M = fixangle(M);
//document.debug.log.value += "M = " + M + "\n";
    e = 0.016708634 + (-0.000042037 * T) + (-0.0000001267 * T2);
//document.debug.log.value += "e = " + e + "\n";
    C = ((1.914602 + (-0.004817 * T) + (-0.000014 * T2)) * dsin(M)) +
        ((0.019993 - (0.000101 * T)) * dsin(2 * M)) +
        (0.000289 * dsin(3 * M));
//document.debug.log.value += "C = " + C + "\n";
    sunLong = L0 + C;
//document.debug.log.value += "sunLong = " + sunLong + "\n";
    sunAnomaly = M + C;
//document.debug.log.value += "sunAnomaly = " + sunAnomaly + "\n";
    sunR = (1.000001018 * (1 - (e * e))) / (1 + (e * dcos(sunAnomaly)));
//document.debug.log.value += "sunR = " + sunR + "\n";
    Omega = 125.04 - (1934.136 * T);
//document.debug.log.value += "Omega = " + Omega + "\n";
    Lambda = sunLong + (-0.00569) + (-0.00478 * dsin(Omega));
//document.debug.log.value += "Lambda = " + Lambda + "\n";
    epsilon0 = obliqeq(jd);
//document.debug.log.value += "epsilon0 = " + epsilon0 + "\n";
    epsilon = epsilon0 + (0.00256 * dcos(Omega));
//document.debug.log.value += "epsilon = " + epsilon + "\n";
    Alpha = rtd(Math.atan2(dcos(epsilon0) * dsin(sunLong), dcos(sunLong)));
//document.debug.log.value += "Alpha = " + Alpha + "\n";
    Alpha = fixangle(Alpha);
////document.debug.log.value += "Alpha = " + Alpha + "\n";
    Delta = rtd(Math.asin(dsin(epsilon0) * dsin(sunLong)));
////document.debug.log.value += "Delta = " + Delta + "\n";
    AlphaApp = rtd(Math.atan2(dcos(epsilon) * dsin(Lambda), dcos(Lambda)));
//document.debug.log.value += "AlphaApp = " + AlphaApp + "\n";
    AlphaApp = fixangle(AlphaApp);
//document.debug.log.value += "AlphaApp = " + AlphaApp + "\n";
    DeltaApp = rtd(Math.asin(dsin(epsilon) * dsin(Lambda)));
//document.debug.log.value += "DeltaApp = " + DeltaApp + "\n";

    return new Array(                 //  Quantidades angulares são expressas em graus decimais
        L0,                           //  [0] Longitude média geométrica do Sol
        M,                            //  [1] Anomalia média do Sol
        e,                            //  [2] Excentricidade da órbita da Terra
        C,                            //  [3] A equação do Sol do Centro
        sunLong,                      //  [4] Longitude verdadeira do sol
        sunAnomaly,                   //  [5] A verdadeira anomalia do sol
        sunR,                         //  [6] Vetor do raio do sol em UA
        Lambda,                       //  [7] Longitude aparente do Sol no verdadeiro equinócio da data
        Alpha,                        //  [8] A verdadeira ascensão reta do Sol
        Delta,                        //  [9] verdadeira declinação do sol
        AlphaApp,                     // [10] A aparente ascensão reta do Sol
        DeltaApp                      // [11] Declinação aparente do Sol
    );
}

/*  EQUATIONOFTIME  --  Calcule a equação do tempo para um determinado momento.
                        Retorna a equação do tempo como uma fração de
                        um dia.  */

function equationOfTime(jd)
{
    var alpha, deltaPsi, E, epsilon, L0, tau

    tau = (jd - J2000) / JulianMillennium;
//document.debug.log.value += "equationOfTime.  tau = " + tau + "\n";
    L0 = 280.4664567 + (360007.6982779 * tau) +
         (0.03032028 * tau * tau) +
         ((tau * tau * tau) / 49931) +
         (-((tau * tau * tau * tau) / 15300)) +
         (-((tau * tau * tau * tau * tau) / 2000000));
//document.debug.log.value += "L0 = " + L0 + "\n";
    L0 = fixangle(L0);
//document.debug.log.value += "L0 = " + L0 + "\n";
    alpha = sunpos(jd)[10];
//document.debug.log.value += "alpha = " + alpha + "\n";
    deltaPsi = nutation(jd)[0];
//document.debug.log.value += "deltaPsi = " + deltaPsi + "\n";
    epsilon = obliqeq(jd) + nutation(jd)[1];
//document.debug.log.value += "epsilon = " + epsilon + "\n";
    E = L0 + (-0.0057183) + (-alpha) + (deltaPsi * dcos(epsilon));
//document.debug.log.value += "E = " + E + "\n";
    E = E - 20.0 * (Math.floor(E / 20.0));
//document.debug.log.value += "Efixed = " + E + "\n";
    E = E / (24 * 60);
//document.debug.log.value += "Eday = " + E + "\n";

    return E;
}
