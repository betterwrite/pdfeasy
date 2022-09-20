import { Content } from '../pipe/factory'

export const loremIpsum = () => {
  const paragraph = () => {
    const arr = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at odio elit. Vivamus imperdiet id enim a ullamcorper. Sed blandit sem sit amet mauris volutpat, et fermentum urna placerat. Proin pretium rhoncus lobortis. Aenean ullamcorper posuere odio a elementum. Praesent placerat vestibulum elementum. Proin ultricies tellus id convallis hendrerit. Ut convallis pretium lectus, posuere venenatis eros rhoncus sed. Cras venenatis tempor turpis interdum consequat. Suspendisse at viverra lacus. Phasellus malesuada ut est ut pretium. Nullam lorem odio, interdum a neque non, pulvinar luctus leo.',
      'In non iaculis erat. Aliquam euismod nunc augue, eget fermentum orci vulputate id. Suspendisse placerat dui id rutrum aliquam. Etiam quis ultricies tellus, at fermentum est. Fusce non cursus nisl. Donec pulvinar feugiat augue. Nulla arcu sapien, aliquet in consequat sed, placerat in metus. Praesent gravida ligula quis orci laoreet sodales. Aenean id turpis ac velit dictum lacinia.',
      'Morbi posuere ultricies dolor eget condimentum. Pellentesque eu ligula massa. Nam facilisis vestibulum lacus et pellentesque. In nec pharetra orci. Duis congue nibh ex, vel sagittis ex venenatis ac. Praesent consequat enim sit amet leo iaculis sodales. Praesent eu nibh tortor. Maecenas eu quam ut leo condimentum ullamcorper. Sed ultrices luctus diam in finibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam laoreet pellentesque dui, eu dictum nisi finibus hendrerit.',
      'Aliquam lobortis quis felis sed mollis. Nulla non venenatis odio, eu semper velit. Maecenas convallis diam diam, a pellentesque odio mattis condimentum. Phasellus pulvinar quam lectus, sit amet sodales odio venenatis at. Fusce vitae scelerisque magna. Quisque molestie lacus a tortor sagittis sagittis. Aliquam erat volutpat. Vestibulum et dolor vitae ex imperdiet elementum. Sed facilisis vel erat finibus faucibus. Donec cursus mi id euismod suscipit. Cras laoreet laoreet rutrum. Proin posuere luctus neque, a varius tellus posuere non. Aliquam placerat massa scelerisque nisl iaculis porttitor. Mauris id magna tempor, sollicitudin libero eget, bibendum felis. Aenean sodales mauris odio, quis ullamcorper elit vestibulum sit amet. Vestibulum sed enim eleifend, ullamcorper diam at, pharetra augue.',
      'Aliquam faucibus tortor vel sollicitudin fermentum. Nam a augue ac odio accumsan pellentesque id quis odio. Maecenas imperdiet urna vitae risus aliquet, ac aliquam ligula porta. Nunc neque dui, posuere vitae malesuada sit amet, convallis vel enim. Ut malesuada ornare sapien commodo luctus. Curabitur varius ac justo id egestas. Sed non gravida nisi. Donec semper quam sapien, in ornare orci cursus et. Proin aliquet est fermentum justo vehicula, at lacinia nulla facilisis.',
    ]

    return arr[Math.floor(Math.random() * arr.length)]
  }

  const title = () => {
    const arr = [
      'Lorem ipsum',
      'In non iaculis erat',
      'Morbi posuere',
      'Aliquam lobortis',
      'Aliquam faucibus',
    ]

    return arr[Math.floor(Math.random() * arr.length)]
  }

  return { paragraph, title }
}

export const content = (): Content[] => {
  return [
    { raw: loremIpsum().title() },
    { raw: loremIpsum().paragraph(), text: { fontSize: 18 } },
    {
      stack: [
        { raw: loremIpsum().paragraph(), text: { lineHeight: 10 } },
        { raw: loremIpsum().paragraph(), text: { lineHeight: 2 } },
      ],
    },
    { raw: loremIpsum().paragraph(), text: {} },
  ]
}
