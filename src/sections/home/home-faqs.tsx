import type { BoxProps } from '@mui/material/Box';

import { useState } from 'react';
import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion, { accordionClasses } from '@mui/material/Accordion';
import AccordionDetails, { accordionDetailsClasses } from '@mui/material/AccordionDetails';
import AccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatPlusIcon, FloatTriangleDownIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

const FAQs = [
  {
    question: 'Khám Phá Công Nghệ',
    answer: (
      <Box>
        <Typography>
          Học Tập Tương Tác: Sử dụng nền tảng trực tuyến để học hỏi và tương tác.
        </Typography>
        <Typography>
          Công nghệ thông tin đang thay đổi cách chúng ta học hỏi và giao tiếp. Việc làm quen với
          các công cụ công nghệ mới sẽ giúp học sinh phát triển kỹ năng cần thiết cho tương lai.
        </Typography>
      </Box>
    ),
  },
  {
    question: 'Trí Tuệ Nhân Tạo',
    answer: (
      <Box>
        <Typography>
          Hỗ Trợ Học Tập: Trí tuệ nhân tạo giúp cá nhân hóa trải nghiệm học tập.
        </Typography>
        <Typography>
          Phân Tích Dữ Liệu: Sử dụng AI để đánh giá tiến trình học tập của học sinh.
        </Typography>
        <Typography>
          Trí tuệ nhân tạo không chỉ giúp cải thiện quá trình học tập mà còn cung cấp các phương
          pháp học tập tùy chỉnh dựa trên nhu cầu và sở thích cá nhân của học sinh.
        </Typography>
      </Box>
    ),
  },
  {
    question: 'Kiểm Tra & Đánh Giá',
    answer: (
      <Box>
        <Typography>
          Phương Pháp Kiểm Tra Hiện Đại: Các công cụ đánh giá trực tuyến giúp theo dõi hiệu suất.
        </Typography>
        <Typography>Phản Hồi Nhanh Chóng: Nhận phản hồi tức thì để cải thiện kỹ năng.</Typography>
        <Typography>
          Việc sử dụng công nghệ trong kiểm tra và đánh giá giúp cải thiện tính chính xác và tiết
          kiệm thời gian, đồng thời cung cấp cho học sinh phản hồi cần thiết để phát triển.
        </Typography>
      </Box>
    ),
  },
  {
    question: 'Học Sinh Là Trung Tâm',
    answer: (
      <Box>
        <Typography>
          Khuyến Khích Sáng Tạo: Tạo ra môi trường học tập khuyến khích sự sáng tạo và đổi mới.
        </Typography>
        <Typography>
          Tác & Giao Tiếp: Phát triển kỹ năng làm việc nhóm và giao tiếp hiệu quả.
        </Typography>
        <Typography>
          Tập trung vào học sinh giúp tạo ra một môi trường học tập tích cực, nơi mà học sinh cảm
          thấy được khuyến khích để thể hiện bản thân và phát triển kỹ năng xã hội.
        </Typography>
      </Box>
    ),
  },
  {
    question: 'Kỹ Năng Mềm',
    answer: (
      <Box>
        <Typography>
          Kỹ Năng Giao Tiếp: Học sinh cần phát triển khả năng giao tiếp hiệu quả với bạn bè và giáo
          viên.
        </Typography>
        <Typography>
          Kỹ Năng Giải Quyết Vấn Đề: Khả năng tư duy phản biện và giải quyết các tình huống trong
          học tập và cuộc sống là rất quan trọng.
        </Typography>
        <Typography>
          Phát triển kỹ năng mềm không chỉ giúp học sinh trong học tập mà còn trong sự nghiệp tương
          lai, giúp họ tự tin hơn trong các tình huống giao tiếp và làm việc nhóm.
        </Typography>
      </Box>
    ),
  },
];

// ----------------------------------------------------------------------

export function HomeFAQs({ sx, ...other }: BoxProps) {
  const [expanded, setExpanded] = useState<string | false>(FAQs[0].question);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderDescription = () => (
    <SectionTitle
      caption="Mục tiêu"
      title="Mục tiêu đề ra cho"
      txtGradient="ứng dụng"
      sx={{ textAlign: 'center' }}
    />
  );

  const renderContent = () => (
    <Stack
      spacing={1}
      sx={[
        () => ({
          mt: 8,
          mx: 'auto',
          maxWidth: 720,
          mb: { xs: 5, md: 8 },
        }),
      ]}
    >
      {FAQs.map((item, index) => (
        <Accordion
          key={item.question}
          component={m.div}
          variants={varFade('inUp', { distance: 24 })}
          expanded={expanded === item.question}
          onChange={handleChange(item.question)}
          sx={(theme) => ({
            borderRadius: 2,
            transition: theme.transitions.create(['background-color'], {
              duration: theme.transitions.duration.short,
            }),
            '&::before': { display: 'none' },
            '&:hover': { bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16) },
            '&:first-of-type, &:last-of-type': { borderRadius: 2 },
            [`&.${accordionClasses.expanded}`]: {
              m: 0,
              borderRadius: 2,
              boxShadow: 'none',
              bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            },
            [`& .${accordionSummaryClasses.root}`]: {
              py: 3,
              px: 2.5,
              minHeight: 'auto',
              [`& .${accordionSummaryClasses.content}`]: {
                m: 0,
                [`&.${accordionSummaryClasses.expanded}`]: { m: 0 },
              },
            },
            [`& .${accordionDetailsClasses.root}`]: { px: 2.5, pt: 0, pb: 3 },
          })}
        >
          <AccordionSummary
            expandIcon={
              <Iconify
                width={20}
                icon={expanded === item.question ? 'mingcute:minimize-line' : 'mingcute:add-line'}
              />
            }
            aria-controls={`panel${index}bh-content`}
            id={`panel${index}bh-header`}
          >
            <Typography variant="h6"> {item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>{item.answer}</AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );

  const renderContact = () => (
    <Box
      sx={[
        (theme) => ({
          px: 3,
          py: 8,
          textAlign: 'center',
          background: `linear-gradient(to left, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}, transparent)`,
        }),
      ]}
    >
      <m.div variants={varFade('in')}>
        <Typography variant="h4">Vẫn còn thắc mắc?</Typography>
      </m.div>

      <m.div variants={varFade('in')}>
        <Typography sx={{ mt: 2, mb: 3, color: 'text.secondary' }}>
          Vui lòng mô tả trường hợp của bạn để nhận được lời khuyên chính xác nhất
        </Typography>
      </m.div>

      <m.div variants={varFade('in')}>
        <Button
          color="inherit"
          variant="contained"
          size="large"
          href="mailto:a@gmail.com?subject=[Feedback] cho khách hàng"
          startIcon={<Iconify icon="solar:letter-bold" />}
        >
          Liên hệ với chúng tôi
        </Button>
      </m.div>
    </Box>
  );

  return (
    <Box component="section" sx={sx} {...other}>
      <MotionViewport sx={{ py: 10, position: 'relative' }}>
        {topLines()}

        <Container>
          {renderDescription()}
          {renderContent()}
          {renderContact()}
        </Container>

        <Stack sx={{ position: 'relative' }}>{bottomLines()}</Stack>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

const topLines = () => (
  <>
    <Stack
      spacing={8}
      alignItems="center"
      sx={{
        top: 64,
        left: 80,
        position: 'absolute',
        transform: 'translateX(-50%)',
      }}
    >
      <FloatTriangleDownIcon sx={{ position: 'static', opacity: 0.12 }} />
      <FloatTriangleDownIcon
        sx={{
          width: 30,
          height: 15,
          opacity: 0.24,
          position: 'static',
        }}
      />
    </Stack>

    <FloatLine vertical sx={{ top: 0, left: 80 }} />
  </>
);

const bottomLines = () => (
  <>
    <FloatLine sx={{ top: 0, left: 0 }} />
    <FloatLine sx={{ bottom: 0, left: 0 }} />
    <FloatPlusIcon sx={{ top: -8, left: 72 }} />
    <FloatPlusIcon sx={{ bottom: -8, left: 72 }} />
  </>
);
