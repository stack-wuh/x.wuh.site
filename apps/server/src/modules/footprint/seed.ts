import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://docs:docs%4011..@8.153.72.27:27017/docs?directConnection=true&authSource=docs';

const seedData = [
  {
    name: '杨梅坑',
    lng: 114.585,
    lat: 22.55,
    date: new Date('2025-08-15'),
    photos: [],
    videos: [],
    content: '',
  },
  {
    name: '梧桐山',
    lng: 114.23,
    lat: 22.62,
    date: new Date('2025-09-20'),
    photos: [],
    videos: [],
    content: '',
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);

  const schema = new mongoose.Schema({
    name: String,
    lng: Number,
    lat: Number,
    date: Date,
    photos: [String],
    videos: [String],
    content: String,
  }, { timestamps: true, collection: 'footprints' });

  const Model = mongoose.model('Footprint', schema);

  for (const data of seedData) {
    const exists = await Model.findOne({ name: data.name });
    if (!exists) {
      await Model.create(data);
      console.log(`✓ 已插入: ${data.name}`);
    } else {
      console.log(`→ 已存在: ${data.name}`);
    }
  }

  console.log('Seed 完成');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed 失败:', err);
  process.exit(1);
});
