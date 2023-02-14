var J0000 = 1721424.5; // Data juliana da época gregoriana: 0000-01-01
var JMJD = 2400000.5; // Época do sistema de Data Juliana Modificada

var NormLeap = new Array("ano normal", "Ano bissexto");

/*  WEEKDAY_BEFORE -- Retorna a data juliana de determinado dia da semana (0 = domingo)
                        nos sete dias que terminam em jd. */

function weekday_before(weekday, jd) {
    return jd - jwday(jd - weekday);
}

/*  SEARCH_WEEKDAY -- Determina a data juliana para: 

            weekday      Dia da semana desejado, 0 = Domingo
            jd          Data juliana para iniciar a pesquisa
            direction    1 = próximo dia da semana, -1 = último dia da semana
            offset       Deslocamento de jd para iniciar a pesquisa
*/

function search_weekday(weekday, jd, direction, offset) {
    return weekday_before(weekday, jd + (direction * offset));
}

//  Funções utilitárias de dia da semana, apenas wrappers para search_weekday

function nearest_weekday(weekday, jd) {
    return search_weekday(weekday, jd, 1, 3);
}

function next_weekday(weekday, jd) {
    return search_weekday(weekday, jd, 1, 7);
}

function next_or_current_weekday(weekday, jd) {
    return search_weekday(weekday, jd, 1, 6);
}

function previous_weekday(weekday, jd) {
    return search_weekday(weekday, jd, -1, 1);
}

function previous_or_current_weekday(weekday, jd) {
    return search_weekday(weekday, jd, 1, 0);
}

function TestSomething() {}

//  LEAP_GREGORIAN  -- Um determinado ano no calendário gregoriano é um ano bissexto?

function leap_gregorian(year) {
    return ((year % 4) == 0) &&
        (!(((year % 100) == 0) && ((year % 400) != 0)));
}

//  GREGORIAN_TO_JD  --  Determinar o número do dia juliano a partir da data do calendário gregoriano

var GREGORIAN_EPOCH = 1721425.5;

function gregorian_to_jd(year, month, day) {
    return (GREGORIAN_EPOCH - 1) +
        (365 * (year - 1)) +
        Math.floor((year - 1) / 4) +
        (-Math.floor((year - 1) / 100)) +
        Math.floor((year - 1) / 400) +
        Math.floor((((367 * month) - 362) / 12) +
            ((month <= 2) ? 0 :
                (leap_gregorian(year) ? -1 : -2)
            ) +
            day);
}

//  JD_TO_GREGORIAN  --  Calcular a data do calendário gregoriano a partir do dia juliano

function jd_to_gregorian(jd) {
    var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
        yindex, dyindex, year, yearday, leapadj;

    wjd = Math.floor(jd - 0.5) + 0.5;
    depoch = wjd - GREGORIAN_EPOCH;
    quadricent = Math.floor(depoch / 146097);
    dqc = mod(depoch, 146097);
    cent = Math.floor(dqc / 36524);
    dcent = mod(dqc, 36524);
    quad = Math.floor(dcent / 1461);
    dquad = mod(dcent, 1461);
    yindex = Math.floor(dquad / 365);
    year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
    if (!((cent == 4) || (yindex == 4))) {
        year++;
    }
    yearday = wjd - gregorian_to_jd(year, 1, 1);
    leapadj = ((wjd < gregorian_to_jd(year, 3, 1)) ? 0 :
        (leap_gregorian(year) ? 1 : 2)
    );
    month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    day = (wjd - gregorian_to_jd(year, month, 1)) + 1;

    return new Array(year, month, day);
}

//  ISO_TO_JULIAN  --  Retorna o dia Juliano de determinado ano, semana e dia ISO

function n_weeks(weekday, jd, nthweek) {
    var j = 7 * nthweek;

    if (nthweek > 0) {
        j += previous_weekday(weekday, jd);
    } else {
        j += next_weekday(weekday, jd);
    }
    return j;
}

function iso_to_julian(year, week, day) {
    return day + n_weeks(0, gregorian_to_jd(year - 1, 12, 28), week);
}

//  JD_TO_ISO  --  Matriz de retorno de ISO (ano, semana, dia) para o dia juliano

function jd_to_iso(jd) {
    var year, week, day;

    year = jd_to_gregorian(jd - 3)[0];
    if (jd >= iso_to_julian(year + 1, 1, 1)) {
        year++;
    }
    week = Math.floor((jd - iso_to_julian(year, 1, 1)) / 7) + 1;
    day = jwday(jd);
    if (day == 0) {
        day = 7;
    }
    return new Array(year, week, day);
}

//  ISO_DAY_TO_JULIAN  --  Retorna o dia juliano do ano ISO fornecido e o dia do ano

function iso_day_to_julian(year, day) {
    return (day - 1) + gregorian_to_jd(year, 1, 1);
}

//  JD_TO_ISO_DAY  --  Matriz de retorno de ISO (ano, dia_do_ano) para o dia juliano

function jd_to_iso_day(jd) {
    var year, day;

    year = jd_to_gregorian(jd)[0];
    day = Math.floor(jd - gregorian_to_jd(year, 1, 1)) + 1;
    return new Array(year, day);
}

/*  PAD  --  Preencha uma string com um determinado comprimento com um determinado caractere de preenchimento. */

function pad(str, howlong, padwith) {
    var s = str.toString();

    while (s.length < howlong) {
        s = padwith + s;
    }
    return s;
}

//  JULIAN_TO_JD  --  Determine o número do dia juliano a partir da data do calendário juliano

var JULIAN_EPOCH = 1721423.5;

function leap_julian(year) {
    return mod(year, 4) == ((year > 0) ? 0 : 3);
}

function julian_to_jd(year, month, day) {

    /* Ajuste os anos negativos da era comum para a notação baseada em zero que usamos.  */

    if (year < 1) {
        year++;
    }

    if (month <= 2) {
        year--;
        month += 12;
    }

    return ((Math.floor((365.25 * (year + 4716))) +
        Math.floor((30.6001 * (month + 1))) +
        day) - 1524.5);
}

//  JD_TO_JULIAN  --  Calcular a data do calendário juliano a partir do dia juliano

function jd_to_julian(td) {
    var z, a, alpha, b, c, d, e, year, month, day;

    td += 0.5;
    z = Math.floor(td);

    a = z;
    b = a + 1524;
    c = Math.floor((b - 122.1) / 365.25);
    d = Math.floor(365.25 * c);
    e = Math.floor((b - d) / 30.6001);

    month = Math.floor((e < 14) ? (e - 1) : (e - 13));
    year = Math.floor((month > 2) ? (c - 4716) : (c - 4715));
    day = b - d - Math.floor(30.6001 * e);

    /*  Se o ano for menor que 1, subtraia um para converter de
        um sistema de data baseado em zero para o sistema de era comum em
        qual o ano -1 (1 A.C.) é seguido pelo ano 1 (1 D.C.). */

    if (year < 1) {
        year--;
    }

    return new Array(year, month, day);
}

//  HEBREW_TO_JD  --  Determinar o dia juliano a partir da data hebraica

var HEBREW_EPOCH = 347995.5;

//  Um determinado ano hebraico é um ano bissexto?

function hebrew_leap(year) {
    return mod(((year * 7) + 1), 19) < 7;
}

//  Quantos meses há em um ano hebraico (12 = normal, 13 = bissexto)

function hebrew_year_months(year) {
    return hebrew_leap(year) ? 13 : 12;
}

// Teste para atrasar o início do ano novo e para evitar
// Domingo, quarta e sexta-feira como início do ano novo.

function hebrew_delay_1(year) {
    var months, days, parts;

    months = Math.floor(((235 * year) - 234) / 19);
    parts = 12084 + (13753 * months);
    day = (months * 29) + Math.floor(parts / 25920);

    if (mod((3 * (day + 1)), 7) < 3) {
        day++;
    }
    return day;
}

//  Verifique se há atraso no início do ano novo devido à duração dos anos adjacentes

function hebrew_delay_2(year) {
    var last, present, next;

    last = hebrew_delay_1(year - 1);
    present = hebrew_delay_1(year);
    next = hebrew_delay_1(year + 1);

    return ((next - present) == 356) ? 2 :
        (((present - last) == 382) ? 1 : 0);
}

//  Quantos dias tem um ano hebraico?

function hebrew_year_days(year) {
    return hebrew_to_jd(year + 1, 7, 1) - hebrew_to_jd(year, 7, 1);
}

// Quantos dias tem um determinado mês de um determinado ano

function hebrew_month_days(year, month) {
    //  Em primeiro lugar, descarte os meses de duração fixa de 29 dias

    if (month == 2 || month == 4 || month == 6 ||
        month == 10 || month == 13) {
        return 29;
    }

    //  Se não for bissexto, Adar tem 29 dias

    if (month == 12 && !hebrew_leap(year)) {
        return 29;
    }

    //  Se for Heshvan, os dias dependem da duração do ano

    if (month == 8 && !(mod(hebrew_year_days(year), 10) == 5)) {
        return 29;
    }

    //  Da mesma forma, Kislev varia com a duração do ano

    if (month == 9 && (mod(hebrew_year_days(year), 10) == 3)) {
        return 29;
    }

    //  Não, é um mês de 30 dias

    return 30;
}

//  Por fim, envolva tudo em...

function hebrew_to_jd(year, month, day) {
    var jd, mon, months;

    months = hebrew_year_months(year);
    jd = HEBREW_EPOCH + hebrew_delay_1(year) +
        hebrew_delay_2(year) + day + 1;

    if (month < 7) {
        for (mon = 7; mon <= months; mon++) {
            jd += hebrew_month_days(year, mon);
        }
        for (mon = 1; mon < month; mon++) {
            jd += hebrew_month_days(year, mon);
        }
    } else {
        for (mon = 7; mon < month; mon++) {
            jd += hebrew_month_days(year, mon);
        }
    }

    return jd;
}

/*  JD_TO_HEBREW  --  Converter data juliana para data hebraica
                      Isso funciona fazendo várias chamadas para
                      a função inversa, e isso é muito
                      lento.  */

function jd_to_hebrew(jd) {
    var year, month, day, i, count, first;

    jd = Math.floor(jd) + 0.5;
    count = Math.floor(((jd - HEBREW_EPOCH) * 98496.0) / 35975351.0);
    year = count - 1;
    for (i = count; jd >= hebrew_to_jd(i, 7, 1); i++) {
        year++;
    }
    first = (jd < hebrew_to_jd(year, 1, 1)) ? 7 : 1;
    month = first;
    for (i = first; jd > hebrew_to_jd(year, i, hebrew_month_days(year, i)); i++) {
        month++;
    }
    day = (jd - hebrew_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
}

//  LEAP_ISLAMIC  --  Um determinado ano é um ano bissexto no calendário islâmico?

function leap_islamic(year) {
    return (((year * 11) + 14) % 30) < 11;
}

//  ISLAMIC_TO_JD  --  Determinar o dia juliano a partir da data islâmica

var ISLAMIC_EPOCH = 1948439.5;
var ISLAMIC_WEEKDAYS = new Array("al-'ahad", "al-'ithnayn",
    "ath-thalatha'", "al-'arb`a'",
    "al-khamis", "al-jum`a", "as-sabt");

function islamic_to_jd(year, month, day) {
    return (day +
        Math.ceil(29.5 * (month - 1)) +
        (year - 1) * 354 +
        Math.floor((3 + (11 * year)) / 30) +
        ISLAMIC_EPOCH) - 1;
}

//  JD_TO_ISLAMIC  --  Calcular data islâmica a partir do dia juliano

function jd_to_islamic(jd) {
    var year, month, day;

    jd = Math.floor(jd) + 0.5;
    year = Math.floor(((30 * (jd - ISLAMIC_EPOCH)) + 10646) / 10631);
    month = Math.min(12,
        Math.ceil((jd - (29 + islamic_to_jd(year, 1, 1))) / 29.5) + 1);
    day = (jd - islamic_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
}

/*  TEHRAN_EQUINOX  --  Determine o dia Juliano e a fração do
                        Equinócio de março no meridiano de Teerã em
                        um determinado ano gregoriano.*/

function tehran_equinox(year) {
    var equJED, equJD, equAPP, equTehran, dtTehran;

    //  Equinócio de março em tempo dinâmico
    equJED = equinox(year, 0);

    //  Corrija o delta T para obter a hora universal
    equJD = equJED - (deltat(year) / (24 * 60 * 60));

    //  Aplique a equação do tempo para obter o tempo aparente em Greenwich
    equAPP = equJD + equationOfTime(equJED);

    /*  Finalmente, devemos corrigir a diferença constante entre
        o meridiano de Greenwich e o padrão de fuso horário para
Horário padrão do Irã, 52:30' para o leste.  */

    dtTehran = (52 + (30 / 60.0) + (0 / (60.0 * 60.0))) / 360;
    equTehran = equAPP + dtTehran;

    return equTehran;
}


/*  TEHRAN_EQUINOX_JD  --  Calcule o dia Juliano durante o qual o
                           Equinócio de março, contado a partir de Teerã
                           meridiano, ocorreu para um dado gregoriano
                           ano.  */

function tehran_equinox_jd(year) {
    var ep, epg;

    ep = tehran_equinox(year);
    epg = Math.floor(ep);

    return epg;
}



/*  updateFromGregorian  -- Atualize todos os calendários do gregoriano.
                             "Por que não sair com Julian?" você pergunta. Porque
                             começando pelas garantias gregorianas, estamos
                             já ajustado para um segundo inteiro, então
                             não obtemos erros de arredondamento em outros
                             calendários. */

function updateFromGregorian() {
    var j, year, mon, mday, hour, min, sec,
        weekday, julcal, hebcal, islcal, hmindex, utime, isoweek,
        may_countcal, mayhaabcal, maytzolkincal, frrcal,
        indcal, isoday, xgregcal;

    year = new Number(document.gregorian.year.value);
    mon = document.gregorian.month.selectedIndex;
    mday = new Number(document.gregorian.day.value);
    hour = min = sec = 0;
    hour = new Number(document.gregorian.hour.value);
    min = new Number(document.gregorian.min.value);
    sec = new Number(document.gregorian.sec.value);

    //  Atualizar o dia juliano

    j = gregorian_to_jd(year, mon + 1, mday) +
        (Math.floor(sec + 60 * (min + 60 * hour) + 0.5) / 86400.0);

    document.julianday.day.value = j;
    document.modifiedjulianday.day.value = j - JMJD;

    //  Atualizar o dia da semana na caixa gregoriana

    weekday = jwday(j);
    document.gregorian.wday.value = Weekdays[weekday];

    //  Atualize o status do ano bissexto na caixa gregoriana

    document.gregorian.leap.value = NormLeap[leap_gregorian(year) ? 1 : 0];

    //  Atualizar Calendário Juliano

    julcal = jd_to_julian(j);
    document.juliancalendar.year.value = julcal[0];
    document.juliancalendar.month.selectedIndex = julcal[1] - 1;
    document.juliancalendar.day.value = julcal[2];
    document.juliancalendar.leap.value = NormLeap[leap_julian(julcal[0]) ? 1 : 0];
    weekday = jwday(j);
    document.juliancalendar.wday.value = Weekdays[weekday];

    //  Atualizar Calendário Hebraico

    hebcal = jd_to_hebrew(j);
    if (hebrew_leap(hebcal[0])) {
        document.hebrew.month.options.length = 13;
        document.hebrew.month.options[11] = new Option("Adar I");
        document.hebrew.month.options[12] = new Option("Veadar");
    } else {
        document.hebrew.month.options.length = 12;
        document.hebrew.month.options[11] = new Option("Adar");
    }
    document.hebrew.year.value = hebcal[0];
    document.hebrew.month.selectedIndex = hebcal[1] - 1;
    document.hebrew.day.value = hebcal[2];
    hmindex = hebcal[1];
    if (hmindex == 12 && !hebrew_leap(hebcal[0])) {
        hmindex = 14;
    }

    switch (hebrew_year_days(hebcal[0])) {
        case 353:
            document.hebrew.leap.value = "Deficiência comum (353 dias)";
            break;

        case 354:
            document.hebrew.leap.value = "Comum regular (354 dias)";
            break;

        case 355:
            document.hebrew.leap.value = "Comum completo (355 dias)";
            break;

        case 383:
            document.hebrew.leap.value = "Deficiência embólica (383 dias)";
            break;

        case 384:
            document.hebrew.leap.value = "Embólica regular (384 dias)";
            break;

        case 385:
            document.hebrew.leap.value = "Embolismo completo (385 dias)";
            break;

        default:
            document.hebrew.leap.value = "Duração do ano inválido: " +
                hebrew_year_days(hebcal[0]) + " dias.";
            break;
    }

    //  Atualizar Calendário Islâmico

    islcal = jd_to_islamic(j);
    document.islamic.year.value = islcal[0];
    document.islamic.month.selectedIndex = islcal[1] - 1;
    document.islamic.day.value = islcal[2];
    document.islamic.leap.value = NormLeap[leap_islamic(islcal[0]) ? 1 : 0];

    // Atualizar número de série gregoriano

    if (document.gregserial != null) {
        document.gregserial.day.value = j - J0000;
    }
}

//  calcGregorian  --  Executar o cálculo começando com uma data gregoriana

function calcGregorian() {
    updateFromGregorian();
}

//  calcJulian  --  Executar o cálculo começando com uma data juliana

function calcJulian() {
    var j, date, time;

    j = new Number(document.julianday.day.value);
    date = jd_to_gregorian(j);
    time = jhms(j);
    document.gregorian.year.value = date[0];
    document.gregorian.month.selectedIndex = date[1] - 1;
    document.gregorian.day.value = date[2];
    document.gregorian.hour.value = pad(time[0], 2, " ");
    document.gregorian.min.value = pad(time[1], 2, "0");
    document.gregorian.sec.value = pad(time[2], 2, "0");
    updateFromGregorian();
}

//  setJulian  -- Defina a data juliana e atualize todos os calendários

function setJulian(j) {
    document.julianday.day.value = new Number(j);
    calcJulian();
}

//  calcModifiedJulian  --  Atualização do dia juliano modificado

function calcModifiedJulian() {
    setJulian((new Number(document.modifiedjulianday.day.value)) + JMJD);
}

//  calcJulianCalendar  --  Atualização do calendário juliano

function calcJulianCalendar() {
    setJulian(julian_to_jd((new Number(document.juliancalendar.year.value)),
        document.juliancalendar.month.selectedIndex + 1,
        (new Number(document.juliancalendar.day.value))));
}

//  calcHebrew  --  Atualização do calendário hebraico

function calcHebrew() {
    setJulian(hebrew_to_jd((new Number(document.hebrew.year.value)),
        document.hebrew.month.selectedIndex + 1,
        (new Number(document.hebrew.day.value))));
}

//  calcIslamic  --  Atualização do calendário islâmico

function calcIslamic() {
    setJulian(islamic_to_jd((new Number(document.islamic.year.value)),
        document.islamic.month.selectedIndex + 1,
        (new Number(document.islamic.day.value))));
}

//  calcGregSerial  -- Atualização do número do dia de série gregoriano

function calcGregSerial() {
    setJulian((new Number(document.gregserial.day.value)) + J0000);
}

//  calcIsoWeek  --  Atualização do ano, semana e dia ISO especificados

function calcIsoWeek() {
    var year = new Number(document.isoweek.year.value),
        week = new Number(document.isoweek.week.value),
        day = new Number(document.isoweek.day.value);

    setJulian(iso_to_julian(year, week, day));
}

//  calcIsoDay  --  Atualização do ano ISO e dia do ano especificados

function calcIsoDay() {
    var year = new Number(document.isoday.year.value),
        day = new Number(document.isoday.day.value);

    setJulian(iso_day_to_julian(year, day));
}


/*  setDateToToday  --  Predefinir os campos em
    o formulário de solicitação até a data de hoje. */

function setDateToToday() {
    var today = new Date();

    var y = today.getYear();
    if (y < 1000) {
        y += 1900;
    }

    document.gregorian.year.value = y;
    document.gregorian.month.selectedIndex = today.getMonth();
    document.gregorian.day.value = today.getDate();
    document.gregorian.hour.value =
        document.gregorian.min.value =
        document.gregorian.sec.value = "00";
}

/*  presetDataToRequest  --  Predefinir a data gregoriana para o
                            data solicitada pela URL campo de pesquisa. */

function presetDataToRequest(s) {
    var eq = s.indexOf("=");
    var set = false;
    if (eq != -1) {
        var calendar = s.substring(0, eq),
            date = decodeURIComponent(s.substring(eq + 1));
        if (calendar.toLowerCase() == "gregoriano") {
            var d = date.match(/^(\d+)\D(\d+)\D(\d+)(\D\d+)?(\D\d+)?(\D\d+)?/);
            if (d != null) {
                // Componentes de data e hora da verificação de sanidade
                if ((d[2] >= 1) && (d[2] <= 12) &&
                    (d[3] >= 1) && (d[3] <= 31) &&
                    ((d[4] == undefined) ||
                        ((d[4].substring(1) >= 0) && (d[4].substring(1) <= 23))) &&
                    ((d[5] == undefined) ||
                        ((d[5].substring(1) >= 0) && (d[5].substring(1) <= 59))) &&
                    ((d[6] == undefined) ||
                        ((d[6].substring(1) >= 0) && (d[6].substring(1) <= 59)))) {
                    document.gregorian.year.value = d[1];
                    document.gregorian.month.selectedIndex = d[2] - 1;
                    document.gregorian.day.value = Number(d[3]);
                    document.gregorian.hour.value = d[4] == undefined ? "00" :
                        d[4].substring(1);
                    document.gregorian.min.value = d[5] == undefined ? "00" :
                        d[5].substring(1);
                    document.gregorian.sec.value = d[6] == undefined ? "00" :
                        d[6].substring(1);
                    calcGregorian();
                    set = true;
                } else {
                    alert("Data gregoriana inválida \"" + date +
                        "\" no pedido de pesquisa");
                }
            } else {
                alert("Data gregoriana inválida \"" + date +
                    "\" no pedido de pesquisa");
            }

        } else if (calendar.toLowerCase() == "juliano") {
            var d = date.match(/^(\d+)\D(\d+)\D(\d+)(\D\d+)?(\D\d+)?(\D\d+)?/);
            if (d != null) {
                // Componentes de data da verificação de sanidade
                if ((d[2] >= 1) && (d[2] <= 12) &&
                    (d[3] >= 1) && (d[3] <= 31) &&
                    ((d[4] == undefined) ||
                        ((d[4].substring(1) >= 0) && (d[4].substring(1) <= 23))) &&
                    ((d[5] == undefined) ||
                        ((d[5].substring(1) >= 0) && (d[5].substring(1) <= 59))) &&
                    ((d[6] == undefined) ||
                        ((d[6].substring(1) >= 0) && (d[6].substring(1) <= 59)))) {
                    document.juliancalendar.year.value = d[1];
                    document.juliancalendar.month.selectedIndex = d[2] - 1;
                    document.juliancalendar.day.value = Number(d[3]);
                    calcJulianCalendar();
                    document.gregorian.hour.value = d[4] == undefined ? "00" :
                        d[4].substring(1);
                    document.gregorian.min.value = d[5] == undefined ? "00" :
                        d[5].substring(1);
                    document.gregorian.sec.value = d[6] == undefined ? "00" :
                        d[6].substring(1);
                    set = true;
                } else {
                    alert("Data do calendário juliano inválida \"" + date +
                        "\" no pedido de pesquisa");
                }
            } else {
                alert("Data do calendário juliano inválida \"" + date +
                    "\" no pedido de pesquisa");
            }

        } else if (calendar.toLowerCase() == "jd") {
            var d = date.match(/^(\-?\d+\.?\d*)/);
            if (d != null) {
                setJulian(d[1]);
                set = 1;
            } else {
                alert("Dia juliano inválido \"" + date +
                    "\" no pedido de pesquisa");
            }

        } else if (calendar.toLowerCase() == "mjd") {
            var d = date.match(/^(\-?\d+\.?\d*)/);
            if (d != null) {
                document.modifiedjulianday.day.value = d[1];
                calcModifiedJulian();
                set = 1;
            } else {
                alert("Dia juliano modificado é inválido \"" + date +
                    "\" no pedido de pesquisa");
            }

        } else if (calendar.toLowerCase() == "unixtime") {
            var d = date.match(/^(\-?\d+\.?\d*)/);
            if (d != null) {
                document.unixtime.time.value = d[1];
                calcUnixTime();
                set = 1;
            } else {
                alert("Dia juliano modificado inválido \"" + date +
                    "\" no pedido de pesquisa");
            }

        } else if (calendar.toLowerCase() == "iso") {
            var d;
            if ((d = date.match(/^(\-?\d+)\-(\d\d\d)/)) != null) {
                document.isoday.year.value = d[1];
                document.isoday.day.value = d[2];
                calcIsoDay();
                set = 1;
            } else if ((d = date.match(/^(\-?\d+)\-?W(\d\d)\-?(\d)/i)) != null) {
                document.isoweek.year.value = d[1];
                document.isoweek.week.value = d[2];
                document.isoweek.day.value = d[3];
                calcIsoWeek();
                set = 1;
            } else {
                alert("Data ISO-8601 inválida\"" + date +
                    "\" no pedido de pesquisa");
            }


        } else {
            alert("Invalid calendar \"" + calendar +
                "\" no pedido de pesquisa");
        }
    } else {
        alert("Solicitação de pesquisa inválida: " + s);
    }

    if (!set) {
        setDateToToday();
        calcGregorian();
    }
}