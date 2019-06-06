const dateDiffInDays = (dayOne, dayTwo) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(dayOne.getFullYear(), dayOne.getMonth(), dayOne.getDate());
    const utc2 = Date.UTC(dayTwo.getFullYear(), dayTwo.getMonth(), dayTwo.getDate());
    return Math.floor((utc2 - utc1) / msPerDay);
}

const buildCaption = apartment => {
    return `${Number(apartment.price.amount).toString()}$, ${apartment.area.total} м², ${apartment.location.address} - ${apartment.url}, Размещено: ${dateDiffInDays(new Date(apartment.created_at), new Date())} дней назад.`;
}

const buildTemplate = async (apartments, reply, replyWithPhoto) => {
    reply(`Найдено: ${apartments.length} квартиры на последнем этаже.`);

    apartments.forEach(apartment => {
        replyWithPhoto(apartment.photo, {
          caption: buildCaption(apartment),
        });
    });
}

module.exports = {
    buildTemplate: buildTemplate,
    dateDiffInDays: dateDiffInDays,
}